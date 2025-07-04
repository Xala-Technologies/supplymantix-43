import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReporting } from "@/contexts/ReportingContext";
import { GroupedData } from "@/types/reporting";

export const useGroupedWorkOrders = (groupBy: string) => {
  const { dateRange, filters } = useReporting();
  
  return useQuery({
    queryKey: ["grouped-work-orders", groupBy, dateRange, filters],
    queryFn: async (): Promise<GroupedData[]> => {
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

      let filteredWorkOrders = workOrders || [];
      
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

      const grouped = new Map<string, { assigned: number; completed: number; data: any }>();

      filteredWorkOrders.forEach(wo => {
        let groupKey: string;
        let groupData: any = {};

        switch (groupBy) {
          case 'team':
            groupKey = wo.tags?.[0] || 'Unassigned';
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
            groupKey = 'Internal';
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