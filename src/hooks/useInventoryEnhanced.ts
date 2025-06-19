
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEnhancedApi, type InventoryItemWithStats } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";

// Get current user's tenant ID (simplified for now)
const getCurrentTenantId = () => 'default-tenant-id';

// Enhanced inventory items query
export const useInventoryEnhanced = (params?: {
  search?: string;
  location?: string;
  status?: 'low_stock' | 'in_stock' | 'out_of_stock';
  sortBy?: 'name' | 'quantity' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["inventory-enhanced", params],
    queryFn: async () => {
      console.log('useInventoryEnhanced query executing with params:', params);
      const result = await inventoryEnhancedApi.searchInventory(params || {});
      console.log('useInventoryEnhanced query result:', result);
      return result;
    },
    retry: 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Low stock alerts
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: inventoryEnhancedApi.getLowStockAlerts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

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
      const result = await inventoryEnhancedApi.createInventoryItem({
        ...item,
        tenant_id: getCurrentTenantId(),
        min_quantity: item.min_quantity || 0,
        unit_cost: item.unit_cost || 0
      });
      console.log('Create result:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
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

// Stock movement mutations
export const useAddStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, quantity, note }: { 
      inventoryId: string; 
      quantity: number; 
      note?: string; 
    }) => inventoryEnhancedApi.addStock(inventoryId, quantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Added ${variables.quantity} units to stock`);
    },
    onError: (error) => {
      console.error("Failed to add stock:", error);
      toast.error("Failed to add stock: " + (error as Error).message);
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, quantity, note }: { 
      inventoryId: string; 
      quantity: number; 
      note?: string;
    }) => inventoryEnhancedApi.removeStock(inventoryId, quantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Removed ${variables.quantity} units from stock`);
    },
    onError: (error) => {
      console.error("Failed to remove stock:", error);
      toast.error("Failed to remove stock: " + (error as Error).message);
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, newQuantity, note }: { 
      inventoryId: string; 
      newQuantity: number; 
      note?: string; 
    }) => inventoryEnhancedApi.adjustStock(inventoryId, newQuantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Adjusted stock to ${variables.newQuantity} units`);
    },
    onError: (error) => {
      console.error("Failed to adjust stock:", error);
      toast.error("Failed to adjust stock: " + (error as Error).message);
    },
  });
};
