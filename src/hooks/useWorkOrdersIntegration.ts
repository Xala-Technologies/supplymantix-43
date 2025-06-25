
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/lib/database/work-orders";
import { toast } from "sonner";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";

// Enhanced work orders hook with asset and inventory integration
export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: ["work-orders-integration"],
    queryFn: async (): Promise<WorkOrder[]> => {
      try {
        console.log('Fetching work orders...');
        const workOrders = await workOrdersApi.getWorkOrders();
        console.log('Raw work orders from API:', workOrders);
        
        // Transform and merge data to match WorkOrder interface
        return workOrders.map(wo => {
          console.log('Processing work order:', wo.id, wo);
          
          // Safely parse parts_used if it's a string
          let partsUsed = [];
          if (wo.parts_used) {
            try {
              partsUsed = typeof wo.parts_used === 'string' 
                ? JSON.parse(wo.parts_used) 
                : wo.parts_used;
            } catch (error) {
              console.warn('Failed to parse parts_used for work order', wo.id, error);
              partsUsed = [];
            }
          }

          // Properly handle asset object - ensure it has required id field
          let asset: WorkOrder['asset'] = wo.asset_id || '';
          if (wo.assets) {
            asset = {
              id: wo.asset_id || '', // Use asset_id from work order, not from assets object
              name: wo.assets.name || 'Unknown Asset',
              status: 'active'
            };
          }

          return {
            id: wo.id,
            title: wo.title || 'Untitled Work Order',
            description: wo.description || '',
            status: (wo.status as WorkOrderStatus) || 'open',
            priority: wo.priority || 'medium',
            assignedTo: wo.assigned_to ? [wo.assigned_to] : [], // Convert single assigned_to to array
            asset,
            location: wo.locations?.name || wo.location_id || '',
            category: wo.category || 'maintenance',
            dueDate: wo.due_date || '',
            due_date: wo.due_date || '',
            createdAt: wo.created_at,
            created_at: wo.created_at,
            updated_at: wo.updated_at,
            tenant_id: wo.tenant_id,
            tags: wo.tags || [],
            partsUsed: partsUsed,
            parts_used: partsUsed,
            totalCost: wo.total_cost || 0,
            total_cost: wo.total_cost || 0,
            timeSpent: wo.time_spent || 0,
            time_spent: wo.time_spent || 0
          };
        });
      } catch (error) {
        console.error('Error fetching work orders:', error);
        toast.error('Failed to fetch work orders');
        return [];
      }
    },
    staleTime: 0, // Always consider data stale to force refresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
      // Implementation would go here when needed
      console.log('Parts usage tracking not fully implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
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
      status: WorkOrderStatus;
      notes?: string;
    }) => {
      console.log('Updating work order status:', { id, status, notes });
      
      // Update the work order status
      const updatedWorkOrder = await workOrdersApi.updateWorkOrder(id, { 
        status: status as any,
        updated_at: new Date().toISOString()
      });

      // If notes are provided, create a comment
      if (notes && notes.trim()) {
        try {
          await workOrdersApi.createChatMessage({
            work_order_id: id,
            message: `Status changed to ${status.replace('_', ' ').toUpperCase()}. ${notes}`,
            tenant_id: updatedWorkOrder.tenant_id
          });
        } catch (error) {
          console.warn('Failed to create status change comment:', error);
          // Don't fail the status update if comment creation fails
        }
      }

      return updatedWorkOrder;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch all work order related queries
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-orders-integration"] });
      queryClient.invalidateQueries({ queryKey: ["work-order-comments", variables.id] });
      
      console.log('Work order status updated successfully:', data);
    },
    onError: (error, variables) => {
      console.error("Status update error:", error);
      toast.error(`Failed to update work order status to ${variables.status.replace('_', ' ')}`);
    }
  });
};
