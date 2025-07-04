import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReporting } from "@/contexts/ReportingContext";
import { ActivityLog } from "@/types/reporting";

export const useActivityLogs = () => {
  const { dateRange, filters } = useReporting();
  
  return useQuery({
    queryKey: ["activity-logs", dateRange, filters],
    queryFn: async (): Promise<ActivityLog[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data: statusHistory, error: statusError } = await supabase
        .from("work_order_status_history")
        .select(`
          *,
          work_order:work_orders(id, title),
          user:users(id, first_name, last_name, email)
        `)
        .eq("tenant_id", userRecord.tenant_id)
        .gte("changed_at", dateRange.from.toISOString())
        .lte("changed_at", dateRange.to.toISOString())
        .order("changed_at", { ascending: false });

      const { data: comments, error: commentsError } = await supabase
        .from("work_order_comments")
        .select(`
          *,
          work_order:work_orders(id, title),
          user:users(id, first_name, last_name, email)
        `)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: false });

      if (statusError) throw statusError;
      if (commentsError) throw commentsError;

      const activities: ActivityLog[] = [];

      statusHistory?.forEach(history => {
        if (history.work_order && history.user) {
          activities.push({
            id: history.id,
            workOrderId: history.work_order.id,
            workOrderTitle: history.work_order.title,
            action: 'status_change',
            user: {
              id: history.user.id,
              name: `${history.user.first_name} ${history.user.last_name}`,
            },
            timestamp: new Date(history.changed_at),
            details: {
              from: history.old_status,
              to: history.new_status,
            },
          });
        }
      });

      comments?.forEach(comment => {
        if (comment.work_order && comment.user) {
          activities.push({
            id: comment.id,
            workOrderId: comment.work_order.id,
            workOrderTitle: comment.work_order.title,
            action: 'comment',
            user: {
              id: comment.user.id,
              name: `${comment.user.first_name} ${comment.user.last_name}`,
            },
            timestamp: new Date(comment.created_at),
            comment: comment.content,
          });
        }
      });

      return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    },
  });
};