import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReporting } from "@/contexts/ReportingContext";
import { format } from "date-fns";
import { WorkOrderSummary } from "@/types/reporting";

export const useWorkOrderSummary = () => {
  const { dateRange, filters } = useReporting();
  
  return useQuery({
    queryKey: ["work-order-summary", dateRange, filters],
    queryFn: async (): Promise<WorkOrderSummary[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data: workOrders, error } = await supabase
        .from("work_orders")
        .select("created_at, completed_at, status")
        .eq("tenant_id", userRecord.tenant_id)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      if (error) throw error;

      const summaryMap = new Map<string, { created: number; completed: number }>();
      
      workOrders?.forEach(wo => {
        const date = format(new Date(wo.created_at), 'yyyy-MM-dd');
        if (!summaryMap.has(date)) {
          summaryMap.set(date, { created: 0, completed: 0 });
        }
        summaryMap.get(date)!.created++;
        
        if (wo.status === 'completed' && wo.completed_at) {
          const completedDate = format(new Date(wo.completed_at), 'yyyy-MM-dd');
          if (!summaryMap.has(completedDate)) {
            summaryMap.set(completedDate, { created: 0, completed: 0 });
          }
          summaryMap.get(completedDate)!.completed++;
        }
      });

      return Array.from(summaryMap.entries()).map(([date, data]) => ({
        date,
        created: data.created,
        completed: data.completed,
      })).sort((a, b) => a.date.localeCompare(b.date));
    },
  });
};