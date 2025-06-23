
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
      console.log('useCreateInventoryItem: Creating inventory item:', item);
      const tenantId = await getCurrentTenantId();
      console.log('useCreateInventoryItem: Using tenant ID:', tenantId);
      
      const result = await inventoryEnhancedApi.createInventoryItem({
        ...item,
        tenant_id: tenantId,
        min_quantity: item.min_quantity || 0,
        unit_cost: item.unit_cost || 0
      });
      
      console.log('useCreateInventoryItem: Create result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('useCreateInventoryItem: Item created successfully:', data);
      console.log('useCreateInventoryItem: Invalidating and refetching queries...');
      
      // Invalidate all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      
      // Force immediate refetch to ensure UI updates
      queryClient.refetchQueries({ 
        queryKey: ["inventory-enhanced"],
        type: 'active'
      });
      
      queryClient.refetchQueries({ 
        queryKey: ["low-stock-alerts"],
        type: 'active'
      });
      
      console.log('useCreateInventoryItem: Queries invalidated and refetched');
      toast.success("Inventory item created successfully");
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
      
      // Invalidate all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      
      // Force immediate refetch
      queryClient.refetchQueries({ 
        queryKey: ["inventory-enhanced"],
        type: 'active'
      });
      
      queryClient.refetchQueries({ 
        queryKey: ["low-stock-alerts"],
        type: 'active'
      });
      
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
      
      // Invalidate all inventory-related queries
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      
      // Force immediate refetch
      queryClient.refetchQueries({ 
        queryKey: ["inventory-enhanced"],
        type: 'active'
      });
      
      queryClient.refetchQueries({ 
        queryKey: ["low-stock-alerts"],
        type: 'active'
      });
      
      toast.success("Inventory item deleted successfully");
    },
    onError: (error) => {
      console.error("useDeleteInventoryItem: Failed to delete inventory item:", error);
      toast.error("Failed to delete inventory item: " + (error as Error).message);
    },
  });
};
