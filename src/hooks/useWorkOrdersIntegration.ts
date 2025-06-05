
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";

// Enhanced work orders hook with asset and inventory integration
export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: ["work-orders-integration"],
    queryFn: async () => {
      try {
        const [workOrders, assets, inventory] = await Promise.all([
          databaseApi.getWorkOrders(),
          databaseApi.getAssets(),
          databaseApi.getInventoryItems()
        ]);
        
        // Merge data for rich display
        return workOrders.map(wo => ({
          ...wo,
          asset: assets.find(a => a.id === wo.asset_id),
          partsUsed: wo.parts_used ? JSON.parse(wo.parts_used as string) : [],
          totalCost: wo.total_cost || 0,
          timeSpent: wo.time_spent || 0,
          priority: wo.priority || 'medium',
          category: wo.category || 'maintenance'
        }));
      } catch (error) {
        console.error('Error fetching work orders:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePartsUsageTracking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ workOrderId, inventoryItemId, quantity, notes }: {
      workOrderId: string;
      inventoryItemId: string;
      quantity: number;
      notes?: string;
    }) => {
      return databaseApi.recordPartsUsage({
        work_order_id: workOrderId,
        inventory_item_id: inventoryItemId,
        quantity,
        notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders-integration"] });
      toast.success("Parts usage recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record parts usage");
      console.error("Parts usage error:", error);
    }
  });
};

export const useWorkOrderStatusUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, notes }: {
      id: string;
      status: string;
      notes?: string;
    }) => {
      return databaseApi.updateWorkOrderStatus(id, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders-integration"] });
      toast.success("Work order status updated");
    },
    onError: (error) => {
      toast.error("Failed to update work order status");
      console.error("Status update error:", error);
    }
  });
};
