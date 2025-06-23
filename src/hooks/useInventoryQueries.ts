
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
      
      // If no search params are provided, get all items
      const result = params && Object.keys(params).length > 0 
        ? await inventoryEnhancedApi.searchInventory(params)
        : await inventoryEnhancedApi.searchInventory({});
        
      console.log('useInventoryEnhanced query result:', result);
      console.log('Number of items returned:', result.items?.length || 0);
      return result;
    },
    retry: 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
