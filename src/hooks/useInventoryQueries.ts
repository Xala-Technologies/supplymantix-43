
import { useQuery } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";

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
      
      try {
        // Always use searchInventory which handles all cases properly
        const result = await inventoryEnhancedApi.searchInventory(params || {});
        console.log('useInventoryEnhanced query success:', result);
        return result;
      } catch (error) {
        console.error('useInventoryEnhanced query error:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Low stock alerts
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: async () => {
      console.log('Fetching low stock alerts...');
      try {
        const result = await inventoryEnhancedApi.getLowStockAlerts();
        console.log('Low stock alerts result:', result);
        return result;
      } catch (error) {
        console.error('Low stock alerts error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};
