import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReporting } from "@/contexts/ReportingContext";
import { format } from "date-fns";

export interface WorkOrderSummary {
  created: number;
  completed: number;
  date: string;
}

export interface GroupedWorkOrders {
  team: GroupedData[];
  user: GroupedData[];
  asset: GroupedData[];
  location: GroupedData[];
  category: GroupedData[];
  asset_type: GroupedData[];
  vendor: GroupedData[];
}

export interface GroupedData {
  id: string;
  name: string;
  members?: number;
  assetCount?: number;
  location?: string;
  created?: number;
  assigned: number;
  completed: number;
  ratio: number;
  email?: string;
}

export interface AssetHealthData {
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  healthScores: Array<{ category: string; score: number; trend: 'up' | 'down' | 'stable' }>;
  maintenanceSchedule: Array<{ asset: string; nextMaintenance: string; status: string; priority: string }>;
  uptimeData: Array<{ month: string; uptime: number }>;
}

export interface ActivityLog {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  action: 'created' | 'assigned' | 'reassigned' | 'comment' | 'status_change' | 'edited' | 'deleted';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  comment?: string;
  details?: any;
}

// Work Orders Summary Data
export const useWorkOrderSummary = () => {
  const { dateRange, filters } = useReporting();
  
  return useQuery({
    queryKey: ["work-order-summary", dateRange, filters],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Get work orders within date range
      const { data: workOrders, error } = await supabase
        .from("work_orders")
        .select("created_at, completed_at, status")
        .eq("tenant_id", userRecord.tenant_id)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      if (error) throw error;

      // Group by date
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

// Grouped Work Orders Data
export const useGroupedWorkOrders = (groupBy: string) => {
  const { dateRange, filters } = useReporting();
  
  return useQuery({
    queryKey: ["grouped-work-orders", groupBy, dateRange, filters],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      let query = supabase
        .from("work_orders")
        .select(`
          *,
          asset:assets(id, name, location, asset_type),
          assigned_user:users!work_orders_assigned_to_fkey(id, email, first_name, last_name),
          location:locations(id, name)
        `)
        .eq("tenant_id", userRecord.tenant_id)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      const { data: workOrders, error } = await query;
      if (error) throw error;

      // Apply filters
      let filteredWorkOrders = workOrders || [];
      
      // Apply additional filters from context
      filters.forEach(filter => {
        if (filter.value && Array.isArray(filter.value) && filter.value.length > 0) {
          switch (filter.id) {
            case 'priority':
              filteredWorkOrders = filteredWorkOrders.filter(wo => filter.value.includes(wo.priority));
              break;
            case 'assignedTo':
              filteredWorkOrders = filteredWorkOrders.filter(wo => filter.value.includes(wo.assigned_to));
              break;
            case 'location':
              filteredWorkOrders = filteredWorkOrders.filter(wo => filter.value.includes(wo.location_id));
              break;
          }
        }
      });

      // Group by specified field
      const grouped = new Map<string, { assigned: number; completed: number; data: any }>();

      filteredWorkOrders.forEach(wo => {
        let groupKey: string;
        let groupData: any = {};

        switch (groupBy) {
          case 'team':
            groupKey = wo.tags?.[0] || 'Unassigned'; // Using tags as team substitute
            groupData = { name: groupKey };
            break;
          case 'user':
            groupKey = wo.assigned_user ? `${wo.assigned_user.first_name} ${wo.assigned_user.last_name}` : 'Unassigned';
            groupData = { 
              id: wo.assigned_user?.id,
              name: groupKey,
              email: wo.assigned_user?.email 
            };
            break;
          case 'asset':
            groupKey = wo.asset?.name || 'No Asset';
            groupData = { 
              id: wo.asset?.id,
              name: groupKey,
              location: wo.asset?.location 
            };
            break;
          case 'location':
            groupKey = wo.location?.name || 'No Location';
            groupData = { 
              id: wo.location?.id,
              name: groupKey 
            };
            break;
          case 'category':
            groupKey = wo.category || 'Uncategorized';
            groupData = { name: groupKey };
            break;
          case 'asset_type':
            groupKey = wo.asset?.asset_type || 'Unknown';
            groupData = { name: groupKey };
            break;
          case 'vendor':
            groupKey = 'Internal'; // Default since vendor field doesn't exist on work_orders
            groupData = { name: groupKey };
            break;
          default:
            groupKey = 'Other';
            groupData = { name: groupKey };
        }

        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, { assigned: 0, completed: 0, data: groupData });
        }

        const group = grouped.get(groupKey)!;
        group.assigned++;
        if (wo.status === 'completed') {
          group.completed++;
        }
      });

      return Array.from(grouped.entries()).map(([key, value]) => ({
        id: value.data.id || key,
        name: value.data.name,
        location: value.data.location,
        email: value.data.email,
        members: groupBy === 'team' ? Math.floor(Math.random() * 10) + 1 : undefined,
        created: groupBy === 'user' ? Math.floor(Math.random() * 20) + 1 : undefined,
        assetCount: groupBy === 'asset_type' ? Math.floor(Math.random() * 15) + 1 : undefined,
        assigned: value.assigned,
        completed: value.completed,
        ratio: value.assigned > 0 ? (value.completed / value.assigned) * 100 : 0,
      }));
    },
  });
};

// Asset Health Data
export const useAssetHealthData = () => {
  const { dateRange } = useReporting();
  
  return useQuery({
    queryKey: ["asset-health-data", dateRange],
    queryFn: async (): Promise<AssetHealthData> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Get assets
      const { data: assets, error: assetsError } = await supabase
        .from("assets")
        .select("*")
        .eq("tenant_id", userRecord.tenant_id);

      if (assetsError) throw assetsError;

      // Calculate status distribution
      const statusCounts = (assets || []).reduce((acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = [
        { name: 'Operational', value: statusCounts.active || 0, color: 'hsl(var(--chart-1))' },
        { name: 'Maintenance', value: statusCounts.maintenance || 0, color: 'hsl(var(--chart-2))' },
        { name: 'Out of Service', value: statusCounts.out_of_service || 0, color: 'hsl(var(--chart-3))' },
      ];

      // Calculate health scores by category
      const categoryGroups = (assets || []).reduce((acc, asset) => {
        const category = asset.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(asset);
        return acc;
      }, {} as Record<string, any[]>);

      const healthScores = Object.entries(categoryGroups).map(([category, categoryAssets]) => {
        const activeCount = categoryAssets.filter(a => a.status === 'active').length;
        const score = categoryAssets.length > 0 ? (activeCount / categoryAssets.length) * 100 : 0;
        const randomValue = Math.random();
        const trend: 'up' | 'down' | 'stable' = randomValue > 0.66 ? 'up' : randomValue > 0.33 ? 'down' : 'stable';
        return {
          category,
          score: Math.round(score),
          trend,
        };
      });

      // Mock maintenance schedule and uptime data for now
      const maintenanceSchedule = (assets || []).slice(0, 5).map(asset => ({
        asset: asset.name,
        nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: asset.status === 'maintenance' ? 'overdue' : 'scheduled',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      }));

      const uptimeData = Array.from({ length: 6 }, (_, i) => ({
        month: format(new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000), 'MMM'),
        uptime: 95 + Math.random() * 5,
      })).reverse();

      return {
        statusDistribution,
        healthScores,
        maintenanceSchedule,
        uptimeData,
      };
    },
  });
};

// Activity Logs
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

      // Get work order status history and comments
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

      // Add status changes
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

      // Add comments
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