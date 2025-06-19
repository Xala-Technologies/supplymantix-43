
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateInventoryItem, useUpdateInventoryItem } from "@/hooks/useInventoryEnhanced";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

interface InventoryFormData {
  name: string;
  description?: string;
  sku?: string;
  location?: string;
  quantity: number;
  min_quantity?: number;
  unit_cost?: number;
}

interface InventoryFormProps {
  item?: InventoryItemWithStats;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  mode?: 'create' | 'edit';
}

export const InventoryForm = ({ item, onSuccess, trigger, mode = 'create' }: InventoryFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormData>({
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      sku: item?.sku || '',
      location: item?.location || '',
      quantity: item?.quantity || 0,
      min_quantity: item?.min_quantity || 0,
      unit_cost: item?.unit_cost || 0,
    },
  });

  const onSubmit = async (data: InventoryFormData) => {
    try {
      console.log('Form submission data:', data);
      
      if (mode === 'edit' && item) {
        await updateMutation.mutateAsync({
          id: item.id,
          updates: {
            name: data.name,
            description: data.description,
            sku: data.sku,
            location: data.location,
            quantity: data.quantity,
            min_quantity: data.min_quantity,
            unit_cost: data.unit_cost,
          }
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          sku: data.sku,
          location: data.location,
          quantity: data.quantity,
          min_quantity: data.min_quantity || 0,
          unit_cost: data.unit_cost || 0,
        });
      }
      
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error('Failed to save inventory item: ' + (error as Error).message);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            {mode === 'edit' ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mode === 'edit' ? 'Edit Item' : 'Add Item'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              {...register("name", { required: "Item name is required" })}
              placeholder="Enter item name"
            />
            {errors.name && (
              <span className="text-sm text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              {...register("sku")}
              placeholder="Enter SKU"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Enter location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                {...register("quantity", { 
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Quantity must be 0 or greater" }
                })}
                placeholder="0"
              />
              {errors.quantity && (
                <span className="text-sm text-red-500">{errors.quantity.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="min_quantity">Min Quantity</Label>
              <Input
                id="min_quantity"
                type="number"
                min="0"
                {...register("min_quantity", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Min quantity must be 0 or greater" }
                })}
                placeholder="0"
              />
              {errors.min_quantity && (
                <span className="text-sm text-red-500">{errors.min_quantity.message}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="unit_cost">Unit Cost</Label>
            <Input
              id="unit_cost"
              type="number"
              min="0"
              step="0.01"
              {...register("unit_cost", { 
                valueAsNumber: true,
                min: { value: 0, message: "Unit cost must be 0 or greater" }
              })}
              placeholder="0.00"
            />
            {errors.unit_cost && (
              <span className="text-sm text-red-500">{errors.unit_cost.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
