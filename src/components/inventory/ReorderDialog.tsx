
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Package, AlertTriangle } from "lucide-react";
import { useCreateReorderPO, useCalculateReorderQuantity } from "@/hooks/useInventoryReorder";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

interface ReorderDialogProps {
  items: InventoryItemWithStats[];
  trigger?: React.ReactNode;
}

export const ReorderDialog = ({ items, trigger }: ReorderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  
  const createReorderPO = useCreateReorderPO();
  const calculateReorderQty = useCalculateReorderQuantity();
  
  // Filter low stock items - items where current quantity <= minimum quantity
  const lowStockItems = items.filter(item => {
    const minQty = item.min_quantity || 0;
    const currentQty = item.quantity || 0;
    return minQty > 0 && currentQty <= minQty;
  });
  
  console.log('ReorderDialog: Total items:', items.length);
  console.log('ReorderDialog: Low stock items:', lowStockItems.length);
  console.log('ReorderDialog: Low stock items details:', lowStockItems.map(item => ({
    name: item.name,
    current: item.quantity,
    min: item.min_quantity
  })));
  
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCustomQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };
  
  const getReorderQuantity = (item: InventoryItemWithStats) => {
    return customQuantities[item.id] ?? calculateReorderQty(item);
  };
  
  const handleCreateReorderPO = async () => {
    if (lowStockItems.length === 0) {
      toast.error("No items need reordering");
      return;
    }

    console.log('Creating reorder PO for items:', lowStockItems);
    
    const reorderItems = lowStockItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      min_quantity: item.min_quantity || 0,
      unit_cost: item.unit_cost || 0,
      reorder_quantity: getReorderQuantity(item)
    }));
    
    console.log('Reorder items payload:', reorderItems);
    
    try {
      await createReorderPO.mutateAsync(reorderItems);
      setOpen(false);
      setCustomQuantities({});
      toast.success(`Reorder PO created for ${reorderItems.length} items`);
    } catch (error) {
      console.error('Failed to create reorder PO:', error);
      toast.error("Failed to create reorder PO: " + (error as Error).message);
    }
  };
  
  const totalCost = lowStockItems.reduce((sum, item) => 
    sum + (getReorderQuantity(item) * (item.unit_cost || 0)), 0
  );
  
  if (lowStockItems.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="flex items-center gap-2" variant="outline" disabled>
              <ShoppingCart className="w-4 h-4" />
              No Items to Reorder
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-500" />
              No Reorder Needed
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Stock Levels Good</h3>
            <p className="text-gray-600">
              All your inventory items are currently above their minimum stock levels.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2" variant="outline">
            <ShoppingCart className="w-4 h-4" />
            Reorder ({lowStockItems.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Create Reorder Purchase Order
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              {lowStockItems.length} items are at or below their minimum stock levels and need reordering.
            </p>
          </div>
          
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    {item.sku && <p className="text-sm text-gray-500">SKU: {item.sku}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="destructive" className="text-xs">
                        Current: {item.quantity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Min: {item.min_quantity}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Unit Cost: ${(item.unit_cost || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`qty-${item.id}`}>Reorder Quantity</Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      value={getReorderQuantity(item)}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Line Total</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-medium">
                      ${(getReorderQuantity(item) * (item.unit_cost || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Order Value:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createReorderPO.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReorderPO}
              disabled={createReorderPO.isPending}
              className="flex items-center gap-2"
            >
              {createReorderPO.isPending ? (
                <>
                  <Package className="w-4 h-4 animate-pulse" />
                  Creating PO...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Create Purchase Order
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
