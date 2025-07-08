import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface TimeLogEntry {
  id: string;
  work_order_id: string;
  user_id: string;
  duration_minutes: number;
  logged_at: string;
  note: string | null;
  user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export const useTimeTracking = (workOrderId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["time-logs", workOrderId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_logs")
        .select(`
          *,
          user:users(email, first_name, last_name)
        `)
        .eq("work_order_id", workOrderId)
        .order("logged_at", { ascending: false });

      if (error) throw error;
      return data as TimeLogEntry[];
    },
    enabled: !!workOrderId && !!user,
    staleTime: 30000,
  });
};

export const useLogTime = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      workOrderId,
      durationMinutes,
      note
    }: {
      workOrderId: string;
      durationMinutes: number;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from("time_logs")
        .insert({
          work_order_id: workOrderId,
          user_id: user?.id!,
          duration_minutes: durationMinutes,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ["time-logs", data.work_order_id, user?.id] 
      });
      toast.success("Time logged successfully");
    },
    onError: (error) => {
      console.error("Error logging time:", error);
      toast.error("Failed to log time");
    },
  });
};