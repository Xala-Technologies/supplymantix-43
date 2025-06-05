
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";

// Enhanced work orders hook with asset and inventory integration
export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: ["work-orders-integration"],
    queryFn: async () => {
      const [workOrders, assets, inventory] = await Promise.all([
        databaseApi.getWorkOrders(),
        databaseApi.getAssets(),
        databaseApi.getInventoryItems()
      ]);
      
      // Merge data for rich display
      return workOrders.map(wo => ({
        ...wo,
        asset: assets.find(a => a.id === wo.asset_id),
        partsUsed: wo.parts_used || [],
        totalCost: wo.total_cost || 0,
        timeSpent: wo.time_spent || 0
      }));
    },
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
      // This would call an RPC function that:
      // 1. Decrements inventory
      // 2. Records parts usage
      // 3. Updates work order costs
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
    }
  });
};
