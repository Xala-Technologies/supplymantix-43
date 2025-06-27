
import { useQuery } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";
import { useDataLoader } from "./useDataLoader";

// Enhanced inventory items query with robust loading
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
        
        // Ensure we always return a valid structure
        if (!result || typeof result !== 'object') {
          console.warn('Invalid result from searchInventory, returning empty structure');
          return { items: [], total: 0 };
        }
        
        return {
          items: Array.isArray(result.items) ? result.items : [],
          total: typeof result.total === 'number' ? result.total : 0
        };
      } catch (error) {
        console.error('useInventoryEnhanced query error:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    // Ensure we have a default value while loading
    placeholderData: { items: [], total: 0 },
  });
};

// Low stock alerts with robust loading
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: async () => {
      console.log('Fetching low stock alerts...');
      try {
        const result = await inventoryEnhancedApi.getLowStockAlerts();
        console.log('Low stock alerts result:', result);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Low stock alerts error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: [],
  });
};
