
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";
import { getCurrentTenantId } from "./useInventoryHelpers";

// Create inventory item
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: {
      name: string;
      description?: string;
      sku?: string;
      location?: string;
      quantity: number;
      min_quantity?: number;
      unit_cost?: number;
    }) => {
      console.log('Creating inventory item:', item);
      const tenantId = await getCurrentTenantId();
      const result = await inventoryEnhancedApi.createInventoryItem({
        ...item,
        tenant_id: tenantId,
        min_quantity: item.min_quantity || 0,
        unit_cost: item.unit_cost || 0
      });
      console.log('Create result:', result);
      return result;
    },
    onSuccess: () => {
      console.log('Item created successfully, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      // Force a refetch of the main inventory query
      queryClient.refetchQueries({ queryKey: ["inventory-enhanced"] });
      toast.success("Inventory item created successfully");
    },
    onError: (error) => {
      console.error("Failed to create inventory item:", error);
      toast.error("Failed to create inventory item: " + (error as Error).message);
    },
  });
};

// Update inventory item
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: {
        name?: string;
        description?: string;
        sku?: string;
        location?: string;
        quantity?: number;
        min_quantity?: number;
        unit_cost?: number;
      }
    }) => {
      console.log('Updating inventory item:', id, updates);
      const result = await inventoryEnhancedApi.updateInventoryItem(id, updates);
      console.log('Update result:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success("Inventory item updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update inventory item:", error);
      toast.error("Failed to update inventory item: " + (error as Error).message);
    },
  });
};

// Delete inventory item
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting inventory item:', id);
      await inventoryEnhancedApi.deleteInventoryItem(id);
      console.log('Delete completed for:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success("Inventory item deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete inventory item:", error);
      toast.error("Failed to delete inventory item: " + (error as Error).message);
    },
  });
};
