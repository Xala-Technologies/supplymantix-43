
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateInventoryItem, useUpdateInventoryItem } from "@/hooks/useInventoryMutations";
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
  const [open, setOpen] = useState(false);
  
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<InventoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      location: '',
      quantity: 0,
      min_quantity: 0,
      unit_cost: 0,
    },
  });

  // Reset form when item changes (for edit mode)
  useEffect(() => {
    if (item && mode === 'edit') {
      console.log('InventoryForm: Resetting form for edit mode with item:', item);
      reset({
        name: item.name || '',
        description: item.description || '',
        sku: item.sku || '',
        location: item.location || '',
        quantity: item.quantity || 0,
        min_quantity: item.min_quantity || 0,
        unit_cost: item.unit_cost || 0,
      });
    } else if (mode === 'create') {
      console.log('InventoryForm: Resetting form for create mode');
      reset({
        name: '',
        description: '',
        sku: '',
        location: '',
        quantity: 0,
        min_quantity: 0,
        unit_cost: 0,
      });
    }
  }, [item, mode, reset, open]);

  const onSubmit = async (data: InventoryFormData) => {
    try {
      console.log('InventoryForm: Form submission started with data:', data);
      console.log('InventoryForm: Mode:', mode, 'Item:', item);
      
      if (mode === 'edit' && item) {
        console.log('InventoryForm: Updating item:', item.id);
        await updateMutation.mutateAsync({
          id: item.id,
          updates: {
            name: data.name,
            description: data.description || '',
            sku: data.sku || '',
            location: data.location || '',
            quantity: Number(data.quantity),
            min_quantity: Number(data.min_quantity) || 0,
            unit_cost: Number(data.unit_cost) || 0,
          }
        });
        console.log('InventoryForm: Update successful');
      } else {
        console.log('InventoryForm: Creating new item');
        const result = await createMutation.mutateAsync({
          name: data.name,
          description: data.description || '',
          sku: data.sku || '',
          location: data.location || '',
          quantity: Number(data.quantity),
          min_quantity: Number(data.min_quantity) || 0,
          unit_cost: Number(data.unit_cost) || 0,
        });
        console.log('InventoryForm: Create successful, result:', result);
      }
      
      // Close dialog and reset form
      setOpen(false);
      
      // Always reset form after successful submission
      reset({
        name: '',
        description: '',
        sku: '',
        location: '',
        quantity: 0,
        min_quantity: 0,
        unit_cost: 0,
      });
      
      // Call success callback
      if (onSuccess) {
        console.log('InventoryForm: Calling onSuccess callback');
        await onSuccess();
      }
      
      console.log('InventoryForm: Form submission completed successfully');
      
    } catch (error) {
      console.error('InventoryForm: Error saving inventory item:', error);
      // Don't close dialog on error so user can fix the issue
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (newOpen: boolean) => {
    console.log('InventoryForm: Dialog open change:', newOpen);
    setOpen(newOpen);
    if (!newOpen && mode === 'create') {
      // Reset form when closing dialog in create mode
      reset({
        name: '',
        description: '',
        sku: '',
        location: '',
        quantity: 0,
        min_quantity: 0,
        unit_cost: 0,
      });
    }
  };

  // Watch all form values for debugging
  const watchedValues = watch();
  console.log('InventoryForm: Current form values:', watchedValues);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <DialogDescription>
            {mode === 'edit' 
              ? 'Update the details of your inventory item.' 
              : 'Enter the details for your new inventory item.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              {...register("name", { required: "Item name is required" })}
              placeholder="Enter item name"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter item description"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Enter location"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.unit_cost && (
              <span className="text-sm text-red-500">{errors.unit_cost.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
