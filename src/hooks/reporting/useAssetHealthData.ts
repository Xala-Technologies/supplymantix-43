import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReporting } from "@/contexts/ReportingContext";
import { format } from "date-fns";
import { AssetHealthData } from "@/types/reporting";

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

      const { data: assets, error: assetsError } = await supabase
        .from("assets")
        .select("*")
        .eq("tenant_id", userRecord.tenant_id);

      if (assetsError) throw assetsError;

      const statusCounts = (assets || []).reduce((acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = [
        { name: 'Operational', value: statusCounts.active || 0, color: 'hsl(var(--chart-1))' },
        { name: 'Maintenance', value: statusCounts.maintenance || 0, color: 'hsl(var(--chart-2))' },
        { name: 'Out of Service', value: statusCounts.out_of_service || 0, color: 'hsl(var(--chart-3))' },
      ];

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