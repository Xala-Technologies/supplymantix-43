import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";
import { WorkOrder } from "@/types/workOrder";

// Enhanced work orders hook with asset and inventory integration
export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: ["work-orders-integration"],
    queryFn: async (): Promise<WorkOrder[]> => {
      try {
        const [workOrders, assets, inventory] = await Promise.all([
          databaseApi.getWorkOrders(),
          databaseApi.getAssets(),
          databaseApi.getInventoryItems()
        ]);
        
        // Transform and merge data to match WorkOrder interface
        return workOrders.map(wo => ({
          id: wo.id,
          title: wo.title || 'Untitled Work Order',
          description: wo.description || '',
          status: wo.status || 'open',
          priority: wo.priority || 'medium',
          assignedTo: wo.assigned_to ? [wo.assigned_to] : [], // Convert single assigned_to to array
          asset: assets.find(a => a.id === wo.asset_id) || {
            id: wo.asset_id || '',
            name: 'Unknown Asset',
            status: 'active'
          },
          location: wo.location_id || '',
          category: wo.category || 'maintenance',
          dueDate: wo.due_date || '',
          due_date: wo.due_date || '',
          createdAt: wo.created_at,
          created_at: wo.created_at,
          updated_at: wo.updated_at,
          tenant_id: wo.tenant_id,
          tags: wo.tags || [],
          partsUsed: wo.parts_used ? JSON.parse(wo.parts_used as string) : [],
          parts_used: wo.parts_used ? JSON.parse(wo.parts_used as string) : [],
          totalCost: wo.total_cost || 0,
          total_cost: wo.total_cost || 0,
          timeSpent: wo.time_spent || 0,
          time_spent: wo.time_spent || 0
        }));
      } catch (error) {
        console.error('Error fetching work orders:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
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
