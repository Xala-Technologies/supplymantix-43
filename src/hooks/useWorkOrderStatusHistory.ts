import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StatusHistoryItem {
  id: string;
  work_order_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  changed_at: string;
  reason?: string | null;
  notes?: string | null;
  tenant_id: string;
  user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export const useWorkOrderStatusHistory = (workOrderId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["work-order-status-history", workOrderId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_order_status_history")
        .select(`
          *,
          user:users(email, first_name, last_name)
        `)
        .eq("work_order_id", workOrderId)
        .order("changed_at", { ascending: false });

      if (error) throw error;
      return data as StatusHistoryItem[];
    },
    enabled: !!workOrderId && !!user,
    staleTime: 30000, // 30 seconds
  });
};