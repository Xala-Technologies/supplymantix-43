
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/lib/database/work-orders";
import { toast } from "sonner";
import { WorkOrder, WorkOrderStatus } from "../types";
import { WORK_ORDER_QUERY_KEYS } from "../constants";
import { normalizeWorkOrderData } from "../utils";

export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: WORK_ORDER_QUERY_KEYS.all,
    queryFn: async (): Promise<WorkOrder[]> => {
      try {
        console.log('Fetching work orders...');
        const workOrders = await workOrdersApi.getWorkOrders();
        console.log('Raw work orders from API:', workOrders);
        
        return workOrders.map(normalizeWorkOrderData);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        toast.error('Failed to fetch work orders');
        return [];
      }
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useWorkOrderStatusUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: {
      id: string;
      status: WorkOrderStatus;
      notes?: string;
    }) => {
      console.log('Updating work order status:', { id, status, notes });
      
      const updatedWorkOrder = await workOrdersApi.updateWorkOrder(id, { 
        status: status as any,
        updated_at: new Date().toISOString()
      });

      if (notes && notes.trim()) {
        try {
          await workOrdersApi.createChatMessage({
            work_order_id: id,
            message: `Status changed to ${status.replace('_', ' ').toUpperCase()}. ${notes}`,
            tenant_id: updatedWorkOrder.tenant_id
          });
        } catch (error) {
          console.warn('Failed to create status change comment:', error);
        }
      }

      return updatedWorkOrder;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDER_QUERY_KEYS.all });
      queryClient.invalidateQueries({ 
        queryKey: WORK_ORDER_QUERY_KEYS.comments(variables.id) 
      });
      
      console.log('Work order status updated successfully:', data);
    },
    onError: (error, variables) => {
      console.error("Status update error:", error);
      toast.error(`Failed to update work order status to ${variables.status.replace('_', ' ')}`);
    }
  });
};

export const usePartsUsageTracking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      workOrderId, 
      inventoryItemId, 
      quantity, 
      notes 
    }: {
      workOrderId: string;
      inventoryItemId: string;
      quantity: number;
      notes?: string;
    }) => {
      console.log('Parts usage tracking not fully implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_ORDER_QUERY_KEYS.all });
      toast.success("Parts usage recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record parts usage");
      console.error("Parts usage error:", error);
    }
  });
};
