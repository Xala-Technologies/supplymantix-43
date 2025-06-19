
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddStock, useRemoveStock, useAdjustStock } from "@/hooks/useInventoryEnhanced";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";

interface StockMovementModalProps {
  item: InventoryItemWithStats;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const StockMovementModal = ({ item, onSuccess, trigger }: StockMovementModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [operationType, setOperationType] = useState<'add' | 'remove' | 'adjust'>('add');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');
  
  const addStockMutation = useAddStock();
  const removeStockMutation = useRemoveStock();
  const adjustStockMutation = useAdjustStock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0 && operationType !== 'adjust') {
      toast.error('Quantity must be greater than 0');
      return;
    }

    try {
      switch (operationType) {
        case 'add':
          await addStockMutation.mutateAsync({
            inventoryId: item.id,
            quantity,
            note: notes
          });
          break;
        case 'remove':
          await removeStockMutation.mutateAsync({
            inventoryId: item.id,
            quantity,
            note: notes
          });
          break;
        case 'adjust':
          await adjustStockMutation.mutateAsync({
            inventoryId: item.id,
            newQuantity: quantity,
            note: notes
          });
          break;
      }
      
      setIsOpen(false);
      setQuantity(0);
      setNotes('');
      onSuccess?.();
    } catch (error) {
      console.error('Stock movement error:', error);
    }
  };

  const isLoading = addStockMutation.isPending || removeStockMutation.isPending || adjustStockMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Manage Stock</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Movement - {item.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-600">
            Current Stock: <span className="font-medium">{item.quantity}</span>
          </div>

          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select value={operationType} onValueChange={(value: 'add' | 'remove' | 'adjust') => setOperationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Stock</SelectItem>
                <SelectItem value="remove">Remove Stock</SelectItem>
                <SelectItem value="adjust">Adjust to Quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">
              {operationType === 'adjust' ? 'Set Quantity To' : 'Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder={operationType === 'adjust' ? 'New total quantity' : 'Quantity to add/remove'}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this stock movement..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
