import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Tables = Database["public"]["Tables"];

// Work Orders
export const useWorkOrders = () => {
  return useQuery({
    queryKey: ["work-orders"],
    queryFn: async () => {
      try {
        console.log('useWorkOrders - Starting query...');
        const result = await databaseApi.getWorkOrders();
        console.log('useWorkOrders - Query successful, got', result?.length || 0, 'work orders');
        return result;
      } catch (error) {
        console.error('useWorkOrders - Query failed:', error);
        toast.error('Failed to fetch work orders: ' + (error instanceof Error ? error.message : 'Unknown error'));
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
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
