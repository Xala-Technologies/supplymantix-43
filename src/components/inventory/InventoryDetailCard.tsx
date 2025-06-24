
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, MapPin, Calendar, Edit, ShoppingCart, TrendingDown, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReorderDialog } from "./ReorderDialog";
import { useInventoryEnhanced } from "@/hooks/useInventoryEnhanced";

interface InventoryDetailCardProps {
  item: {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    quantity: number;
    minQuantity: number;
    unitCost: number;
    totalValue: number;
    location: string;
    supplier: string;
    partNumber: string;
    lastOrdered: string;
    leadTime: string;
    status: string;
    reorderPoint: number;
    maxStock: number;
    transactions: Array<{
      date: string;
      type: string;
      quantity: number;
      reason: string;
    }>;
  };
  onClose?: () => void;
  onEdit?: () => void;
}

export const InventoryDetailCard = ({ item, onClose, onEdit }: InventoryDetailCardProps) => {
  // Get all inventory items for reorder functionality
  const { data: inventoryData } = useInventoryEnhanced();
  const rawItems = inventoryData?.items || [];

  // Convert raw items to the format expected by ReorderDialog
  const allItems = rawItems.map(rawItem => ({
    ...rawItem,
    is_low_stock: (rawItem.quantity || 0) <= (rawItem.min_quantity || 0),
    needs_reorder: (rawItem.quantity || 0) <= (rawItem.min_quantity || 0) * 1.5,
    total_value: (rawItem.quantity || 0) * (rawItem.unit_cost || 0),
  }));

  // Convert current item to the format expected by ReorderDialog
  const currentItemForReorder = {
    id: item.id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    min_quantity: item.minQuantity,
    unit_cost: item.unitCost,
    location: item.location,
    tenant_id: '', // This will be handled by the hook
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: item.description,
    is_low_stock: item.quantity <= item.minQuantity,
    needs_reorder: item.quantity <= item.minQuantity * 1.5,
    total_value: item.quantity * item.unitCost,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on_order':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockLevel = () => {
    const percentage = (item.quantity / item.maxStock) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  // Check if current item needs reordering
  const needsReorder = item.quantity <= item.minQuantity;

  // Filter items that need reordering for the reorder dialog
  const itemsNeedingReorder = allItems.filter(inventoryItem => 
    inventoryItem.quantity <= (inventoryItem.min_quantity || 0)
  );

  const content = (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>SKU: {item.sku}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {item.location}
            </div>
          </div>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`border ${getStatusColor(item.status)}`}>
            {item.status.replace('_', ' ')}
          </Badge>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          <ReorderDialog 
            items={needsReorder ? [currentItemForReorder] : itemsNeedingReorder}
            trigger={
              <Button size="sm" className={needsReorder ? "bg-orange-600 hover:bg-orange-700" : ""}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {needsReorder ? "Reorder Now" : "Reorder"}
              </Button>
            }
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Current Stock</p>
                <p className="text-lg font-semibold">{item.quantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs text-gray-600">Min Quantity</p>
                <p className="text-lg font-semibold">{item.minQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Unit Cost</p>
                <p className="text-lg font-semibold">{formatCurrency(item.unitCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="text-lg font-semibold">{formatCurrency(item.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Level Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Stock Level</span>
            <span className="text-sm text-gray-600">{item.quantity} / {item.maxStock}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all",
                getStockLevel() <= 20 ? "bg-red-500" :
                getStockLevel() <= 40 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${getStockLevel()}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0</span>
            <span>Reorder: {item.reorderPoint}</span>
            <span>Max: {item.maxStock}</span>
          </div>
        </CardContent>
      </Card>

      {/* Reorder Alert */}
      {needsReorder && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-900">Reorder Required</h4>
                <p className="text-sm text-orange-800">
                  Current stock ({item.quantity}) is at or below minimum level ({item.minQuantity}). 
                  Click the Reorder button above to create a purchase order.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Information Tabs */}
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Item Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Part Number</p>
                    <p className="font-medium">{item.partNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Supplier</p>
                    <p className="font-medium">{item.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lead Time</p>
                    <p className="font-medium">{item.leadTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Ordered</p>
                    <p className="font-medium">{item.lastOrdered}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stock Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Stock</span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Minimum Quantity</span>
                    <span className="font-medium">{item.minQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reorder Point</span>
                    <span className="font-medium">{item.reorderPoint}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maximum Stock</span>
                    <span className="font-medium">{item.maxStock}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total Value</span>
                    <span>{formatCurrency(item.totalValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.transactions.length > 0 ? (
                <div className="space-y-3">
                  {item.transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                          transaction.type === 'Usage' ? 'bg-red-500' : 'bg-green-500'
                        )}>
                          {transaction.type === 'Usage' ? '-' : '+'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.type}</p>
                          <p className="text-xs text-gray-600">{transaction.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-medium",
                          transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                        </p>
                        <p className="text-xs text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No transactions recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reorder" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reorder Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={cn(
                  "p-4 border rounded-lg",
                  needsReorder 
                    ? "bg-orange-50 border-orange-200" 
                    : "bg-blue-50 border-blue-200"
                )}>
                  <h4 className={cn(
                    "font-medium mb-2",
                    needsReorder ? "text-orange-900" : "text-blue-900"
                  )}>
                    Reorder Recommendation
                  </h4>
                  <p className={cn(
                    "text-sm",
                    needsReorder ? "text-orange-800" : "text-blue-800"
                  )}>
                    {item.quantity <= item.reorderPoint 
                      ? `Current stock (${item.quantity}) is at or below reorder point (${item.reorderPoint}). Immediate reordering recommended.`
                      : `Stock level is adequate. Reorder when quantity reaches ${item.reorderPoint}.`
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium">Supplier Details</h5>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span>{item.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Part Number:</span>
                        <span>{item.partNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lead Time:</span>
                        <span>{item.leadTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Cost:</span>
                        <span>{formatCurrency(item.unitCost)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Suggested Order</h5>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity to Order:</span>
                        <span>{Math.max(0, item.maxStock - item.quantity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span>{formatCurrency(Math.max(0, item.maxStock - item.quantity) * item.unitCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Delivery:</span>
                        <span>Within {item.leadTime}</span>
                      </div>
                    </div>
                    
                    <ReorderDialog 
                      items={[currentItemForReorder]}
                      trigger={
                        <Button className="w-full mt-4">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Create Purchase Order
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (onClose) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Inventory Item Details</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
