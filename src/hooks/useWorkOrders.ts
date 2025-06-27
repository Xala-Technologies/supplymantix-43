import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { normalizeWorkOrderData } from "@/features/workOrders/utils";

type Tables = Database["public"]["Tables"];

// Work Orders
export const useWorkOrders = () => {
  return useQuery({
    queryKey: ["work-orders"],
    queryFn: async () => {
      try {
        console.log('useWorkOrders - Starting query...');
        const result = await databaseApi.getWorkOrders();
        console.log('useWorkOrders - Raw result:', result);
        
        if (!result || !Array.isArray(result)) {
          console.warn('useWorkOrders - Invalid result format:', result);
          return [];
        }
        
        const normalizedResult = result.map(normalizeWorkOrderData);
        console.log('useWorkOrders - Normalized result:', normalizedResult);
        
        return normalizedResult;
      } catch (error) {
        console.error('useWorkOrders - Query failed:', error);
        toast.error('Failed to fetch work orders: ' + (error instanceof Error ? error.message : 'Unknown error'));
        return []; // Return empty array instead of throwing
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workOrder: Tables["work_orders"]["Insert"]) => {
      try {
        console.log('useCreateWorkOrder - Creating:', workOrder);
        const result = await databaseApi.createWorkOrder(workOrder);
        console.log('useCreateWorkOrder - Success:', result);
        return result;
      } catch (error) {
        console.error('useCreateWorkOrder - Failed:', error);
        toast.error('Failed to create work order: ' + (error instanceof Error ? error.message : 'Unknown error'));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success('Work order created successfully');
    },
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Tables["work_orders"]["Update"] }) => {
      try {
        console.log('useUpdateWorkOrder - Updating:', id, updates);
        const result = await databaseApi.updateWorkOrder(id, updates);
        console.log('useUpdateWorkOrder - Success:', result);
        return result;
      } catch (error) {
        console.error('useUpdateWorkOrder - Failed:', error);
        toast.error('Failed to update work order: ' + (error instanceof Error ? error.message : 'Unknown error'));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success('Work order updated successfully');
    },
  });
};

// Chat Messages
export const useChatMessages = (workOrderId: string) => {
  return useQuery({
    queryKey: ["chat-messages", workOrderId],
    queryFn: () => databaseApi.getChatMessages(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: databaseApi.createChatMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.work_order_id] });
    },
  });
};
