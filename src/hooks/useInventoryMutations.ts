
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
      console.log('useCreateInventoryItem: Starting creation with data:', item);
      const tenantId = await getCurrentTenantId();
      console.log('useCreateInventoryItem: Using tenant ID:', tenantId);
      
      if (!tenantId) {
        throw new Error('No tenant ID found. Please ensure you are logged in.');
      }
      
      const result = await inventoryEnhancedApi.createInventoryItem({
        ...item,
        tenant_id: tenantId,
        min_quantity: item.min_quantity || 0,
        unit_cost: item.unit_cost || 0,
        description: item.description || '',
        sku: item.sku || '',
        location: item.location || ''
      });
      
      console.log('useCreateInventoryItem: Create successful, result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('useCreateInventoryItem: Item created successfully:', data);
      
      // Force invalidate and refetch all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      
      // Also force refetch
      queryClient.refetchQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.refetchQueries({ queryKey: ["low-stock-alerts"] });
      
      // Show success message
      toast.success(`Inventory item "${data.name}" created successfully`);
    },
    onError: (error) => {
      console.error("useCreateInventoryItem: Failed to create inventory item:", error);
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
      console.log('useUpdateInventoryItem: Updating inventory item:', id, updates);
      const result = await inventoryEnhancedApi.updateInventoryItem(id, updates);
      console.log('useUpdateInventoryItem: Update result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('useUpdateInventoryItem: Item updated successfully:', data);
      
      // Force invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      queryClient.refetchQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.refetchQueries({ queryKey: ["low-stock-alerts"] });
      
      toast.success("Inventory item updated successfully");
    },
    onError: (error) => {
      console.error("useUpdateInventoryItem: Failed to update inventory item:", error);
      toast.error("Failed to update inventory item: " + (error as Error).message);
    },
  });
};

// Delete inventory item
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('useDeleteInventoryItem: Deleting inventory item:', id);
      await inventoryEnhancedApi.deleteInventoryItem(id);
      console.log('useDeleteInventoryItem: Delete completed for:', id);
    },
    onSuccess: () => {
      console.log('useDeleteInventoryItem: Item deleted successfully');
      
      // Force invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      queryClient.refetchQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.refetchQueries({ queryKey: ["low-stock-alerts"] });
      
      // Don't show success toast here as it will be handled by the undo system
    },
    onError: (error) => {
      console.error("useDeleteInventoryItem: Failed to delete inventory item:", error);
      toast.error("Failed to delete inventory item: " + (error as Error).message);
    },
  });
};
