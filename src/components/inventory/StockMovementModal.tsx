
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, ArrowRightLeft, Settings } from "lucide-react";
import { useAddStock, useRemoveStock, useTransferStock, useAdjustStock } from "@/hooks/useInventoryEnhanced";
import { useLocations } from "@/hooks/useLocations";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

interface StockMovementModalProps {
  item: InventoryItemWithStats;
  trigger?: React.ReactNode;
}

export const StockMovementModal = ({ item, trigger }: StockMovementModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [newQuantity, setNewQuantity] = useState(item.quantity || 0);

  const addStockMutation = useAddStock();
  const removeStockMutation = useRemoveStock();
  const transferStockMutation = useTransferStock();
  const adjustStockMutation = useAdjustStock();
  const { data: locations } = useLocations();

  const handleAddStock = async () => {
    if (quantity <= 0) return;
    await addStockMutation.mutateAsync({
      inventoryId: item.id,
      quantity,
      note: note || undefined
    });
    setIsOpen(false);
    resetForm();
  };

  const handleRemoveStock = async () => {
    if (quantity <= 0) return;
    await removeStockMutation.mutateAsync({
      inventoryId: item.id,
      quantity,
      note: note || undefined
    });
    setIsOpen(false);
    resetForm();
  };

  const handleTransferStock = async () => {
    if (quantity <= 0 || !fromLocation || !toLocation) return;
    await transferStockMutation.mutateAsync({
      inventoryId: item.id,
      quantity,
      fromLocationId: fromLocation,
      toLocationId: toLocation,
      note: note || undefined
    });
    setIsOpen(false);
    resetForm();
  };

  const handleAdjustStock = async () => {
    if (newQuantity < 0) return;
    await adjustStockMutation.mutateAsync({
      inventoryId: item.id,
      newQuantity,
      note: note || undefined
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setQuantity(1);
    setNote("");
    setFromLocation("");
    setToLocation("");
    setNewQuantity(item.quantity || 0);
  };

  const isLoading = addStockMutation.isPending || removeStockMutation.isPending || 
                   transferStockMutation.isPending || adjustStockMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage Stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Stock - {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Current stock: <span className="font-semibold">{item.quantity || 0}</span> units
          </div>

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="add" className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </TabsTrigger>
              <TabsTrigger value="remove" className="text-xs">
                <Minus className="w-3 h-3 mr-1" />
                Remove
              </TabsTrigger>
              <TabsTrigger value="transfer" className="text-xs">
                <ArrowRightLeft className="w-3 h-3 mr-1" />
                Transfer
              </TabsTrigger>
              <TabsTrigger value="adjust" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Adjust
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div>
                <Label htmlFor="add-quantity">Quantity to Add</Label>
                <Input
                  id="add-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="add-note">Note (optional)</Label>
                <Textarea
                  id="add-note"
                  placeholder="Reason for adding stock..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddStock} 
                disabled={isLoading || quantity <= 0}
                className="w-full"
              >
                Add {quantity} Units
              </Button>
            </TabsContent>

            <TabsContent value="remove" className="space-y-4">
              <div>
                <Label htmlFor="remove-quantity">Quantity to Remove</Label>
                <Input
                  id="remove-quantity"
                  type="number"
                  min="1"
                  max={item.quantity || 0}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="remove-note">Note (optional)</Label>
                <Textarea
                  id="remove-note"
                  placeholder="Reason for removing stock..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleRemoveStock} 
                disabled={isLoading || quantity <= 0 || quantity > (item.quantity || 0)}
                className="w-full"
                variant="destructive"
              >
                Remove {quantity} Units
              </Button>
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <div>
                <Label htmlFor="transfer-quantity">Quantity to Transfer</Label>
                <Input
                  id="transfer-quantity"
                  type="number"
                  min="1"
                  max={item.quantity || 0}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="from-location">From Location</Label>
                <Select value={fromLocation} onValueChange={setFromLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to-location">To Location</Label>
                <Select value={toLocation} onValueChange={setToLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transfer-note">Note (optional)</Label>
                <Textarea
                  id="transfer-note"
                  placeholder="Reason for transfer..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTransferStock} 
                disabled={isLoading || !fromLocation || !toLocation || quantity <= 0}
                className="w-full"
              >
                Transfer {quantity} Units
              </Button>
            </TabsContent>

            <TabsContent value="adjust" className="space-y-4">
              <div>
                <Label htmlFor="new-quantity">New Quantity</Label>
                <Input
                  id="new-quantity"
                  type="number"
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                />
                <div className="text-sm text-gray-500 mt-1">
                  Change: {newQuantity - (item.quantity || 0) > 0 ? '+' : ''}{newQuantity - (item.quantity || 0)}
                </div>
              </div>
              <div>
                <Label htmlFor="adjust-note">Reason for Adjustment</Label>
                <Textarea
                  id="adjust-note"
                  placeholder="Reason for stock adjustment..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAdjustStock} 
                disabled={isLoading || newQuantity < 0}
                className="w-full"
              >
                Adjust to {newQuantity} Units
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
