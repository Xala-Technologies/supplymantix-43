
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { normalizeWorkOrderData } from "@/features/workOrders/utils";
import { useAuth } from "@/contexts/AuthContext";

type Tables = Database["public"]["Tables"];

// Work Orders
export const useWorkOrders = () => {
  const { user, loading: authLoading } = useAuth();
  
  return useQuery({
    queryKey: ["work-orders", user?.id], // Include user ID in query key
    queryFn: async () => {
      try {
        console.log('useWorkOrders - Starting query for user:', user?.email);
        const result = await databaseApi.getWorkOrders();
        console.log('useWorkOrders - Raw result for user:', user?.email, result);
        
        if (!result || !Array.isArray(result)) {
          console.warn('useWorkOrders - Invalid result format:', result);
          return [];
        }
        
        const normalizedResult = result.map(normalizeWorkOrderData);
        console.log('useWorkOrders - Normalized result for user:', user?.email, normalizedResult);
        
        return normalizedResult;
      } catch (error) {
        console.error('useWorkOrders - Query failed:', error);
        // Don't show toast for auth errors, let auth system handle it
        if (error instanceof Error && !error.message.includes('not authenticated')) {
          toast.error('Failed to fetch work orders: ' + error.message);
        }
        return [];
      }
    },
    enabled: !authLoading && !!user, // Only run when user is authenticated
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error instanceof Error && error.message.includes('not authenticated')) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 1000, // Reduce cache time to ensure fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (workOrder: Tables["work_orders"]["Insert"]) => {
      try {
        console.log('useCreateWorkOrder - Creating for user:', user?.email, workOrder);
        const result = await databaseApi.createWorkOrder(workOrder);
        console.log('useCreateWorkOrder - Success for user:', user?.email, result);
        return result;
      } catch (error) {
        console.error('useCreateWorkOrder - Failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to create work order: ' + errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders", user?.id] });
      toast.success('Work order created successfully');
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Tables["work_orders"]["Update"] }) => {
      try {
        console.log('useUpdateWorkOrder - Updating for user:', user?.email, id, updates);
        const result = await databaseApi.updateWorkOrder(id, updates);
        console.log('useUpdateWorkOrder - Success for user:', user?.email, result);
        return result;
      } catch (error) {
        console.error('useUpdateWorkOrder - Failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to update work order: ' + errorMessage);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders", user?.id] });
      toast.success('Work order updated successfully');
    },
  });
};

// Chat Messages
export const useChatMessages = (workOrderId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["chat-messages", workOrderId, user?.id],
    queryFn: () => databaseApi.getChatMessages(workOrderId),
    enabled: !!workOrderId && !!user,
  });
};

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: databaseApi.createChatMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.work_order_id, user?.id] });
    },
  });
};
