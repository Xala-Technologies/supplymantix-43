
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEnhancedApi, type InventoryItemWithStats, type InventoryAlert } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";

// Enhanced inventory items query
export const useInventoryEnhanced = (params?: {
  search?: string;
  category?: string;
  location?: string;
  status?: 'low_stock' | 'in_stock' | 'out_of_stock';
  sortBy?: 'name' | 'quantity' | 'updated_at' | 'value';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["inventory-enhanced", params],
    queryFn: async () => {
      console.log('useInventoryEnhanced query executing with params:', params);
      try {
        const result = await inventoryEnhancedApi.searchInventory(params || {});
        console.log('useInventoryEnhanced query result:', result);
        return result;
      } catch (error) {
        console.error('useInventoryEnhanced query error:', error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Single inventory item with stats
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ["inventory-item", id],
    queryFn: () => inventoryEnhancedApi.getInventoryItemById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Low stock alerts
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: inventoryEnhancedApi.getLowStockAlerts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// CRUD mutations
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Parameters<typeof inventoryEnhancedApi.createInventoryItem>[0]) => {
      console.log('Creating inventory item:', item);
      const result = await inventoryEnhancedApi.createInventoryItem(item);
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
      toast.error("Failed to create inventory item");
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      console.log('Updating inventory item:', id, updates);
      const result = await inventoryEnhancedApi.updateInventoryItem(id, updates);
      console.log('Update result:', result);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success("Inventory item updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update inventory item:", error);
      toast.error("Failed to update inventory item");
    },
  });
};

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
      toast.error("Failed to delete inventory item");
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
      queryClient.invalidateQueries({ queryKey: ["inventory-item", variables.inventoryId] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Added ${variables.quantity} units to stock`);
    },
    onError: (error) => {
      console.error("Failed to add stock:", error);
      toast.error("Failed to add stock");
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inventoryId, quantity, note, workOrderId }: { 
      inventoryId: string; 
      quantity: number; 
      note?: string;
      workOrderId?: string;
    }) => inventoryEnhancedApi.removeStock(inventoryId, quantity, note, workOrderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", variables.inventoryId] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Removed ${variables.quantity} units from stock`);
    },
    onError: (error) => {
      console.error("Failed to remove stock:", error);
      toast.error("Failed to remove stock");
    },
  });
};

export const useTransferStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      inventoryId, 
      quantity, 
      fromLocationId, 
      toLocationId, 
      note 
    }: { 
      inventoryId: string; 
      quantity: number; 
      fromLocationId: string; 
      toLocationId: string; 
      note?: string; 
    }) => inventoryEnhancedApi.transferStock(inventoryId, quantity, fromLocationId, toLocationId, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-item", variables.inventoryId] });
      toast.success(`Transferred ${variables.quantity} units between locations`);
    },
    onError: (error) => {
      console.error("Failed to transfer stock:", error);
      toast.error("Failed to transfer stock");
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
      queryClient.invalidateQueries({ queryKey: ["inventory-item", variables.inventoryId] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Adjusted stock to ${variables.newQuantity} units`);
    },
    onError: (error) => {
      console.error("Failed to adjust stock:", error);
      toast.error("Failed to adjust stock");
    },
  });
};

export const useBulkUpdateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ id: string; quantity: number; note?: string }>) => 
      inventoryEnhancedApi.bulkUpdateStock(updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      toast.success(`Updated ${variables.length} inventory items`);
    },
    onError: (error) => {
      console.error("Failed to bulk update stock:", error);
      toast.error("Failed to bulk update stock");
    },
  });
};

// Export functionality
export const useExportInventory = () => {
  return useMutation({
    mutationFn: inventoryEnhancedApi.exportInventoryToCsv,
    onSuccess: (csvData) => {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Inventory exported successfully");
    },
    onError: (error) => {
      console.error("Failed to export inventory:", error);
      toast.error("Failed to export inventory");
    },
  });
};
