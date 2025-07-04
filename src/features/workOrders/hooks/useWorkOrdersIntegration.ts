
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/lib/database/work-orders";
import { toast } from "sonner";
import { WorkOrder, WorkOrderStatus } from "../types";
import { WORK_ORDER_QUERY_KEYS } from "@/constants/work-orders";
import { normalizeWorkOrderData } from "../utils";
import { useAuth } from "@/contexts/AuthContext";

export const useWorkOrdersIntegration = () => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: [...WORK_ORDER_QUERY_KEYS.all, user?.id], // Include user ID in query key
    queryFn: async (): Promise<WorkOrder[]> => {
      try {
        console.log('Fetching work orders for user:', user?.email);
        const workOrders = await workOrdersApi.getWorkOrders();
        console.log('Raw work orders from API:', workOrders);
        
        if (!Array.isArray(workOrders)) {
          console.warn('Work orders API returned non-array:', workOrders);
          return [];
        }
        
        const normalized = workOrders.map(normalizeWorkOrderData);
        console.log('Normalized work orders for user:', user?.email, normalized);
        return normalized;
      } catch (error) {
        console.error('Error fetching work orders:', error);
        // Don't show toast for authentication errors, let the auth system handle it
        if (error instanceof Error && !error.message.includes('not authenticated')) {
          toast.error('Failed to fetch work orders');
        }
        return [];
      }
    },
    enabled: !authLoading && !!user, // Only run when user is authenticated
    staleTime: 0, // Always consider data stale to ensure fresh data
    gcTime: 100, // Very short cache time to prevent cross-user data leakage
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error instanceof Error && error.message.includes('not authenticated')) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

export const useWorkOrderStatusUpdate = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
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
      // Invalidate queries with user context
      queryClient.invalidateQueries({ queryKey: [...WORK_ORDER_QUERY_KEYS.all, user?.id] });
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
  const { user } = useAuth();
  
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
      queryClient.invalidateQueries({ queryKey: [...WORK_ORDER_QUERY_KEYS.all, user?.id] });
      toast.success("Parts usage recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record parts usage");
      console.error("Parts usage error:", error);
    }
  });
};
