
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";

export const useAssetIntegration = () => {
  return useQuery({
    queryKey: ["assets-integration"],
    queryFn: async () => {
      const [assets, workOrders, procedures] = await Promise.all([
        databaseApi.getAssets(),
        databaseApi.getWorkOrders(),
        databaseApi.getProcedures()
      ]);
      
      return assets.map(asset => {
        const assetWorkOrders = workOrders.filter(wo => wo.asset_id === asset.id);
        const openWorkOrders = assetWorkOrders.filter(wo => 
          !['completed', 'closed', 'cancelled'].includes(wo.status)
        );
        
        const totalDowntime = assetWorkOrders.reduce((sum, wo) => 
          sum + (wo.time_spent || 0), 0
        );
        
        const assetProcedures = procedures.filter(proc => 
          proc.asset_type === asset.category || proc.asset_type === 'all'
        );
        
        return {
          ...asset,
          openWorkOrders: openWorkOrders.length,
          totalWorkOrders: assetWorkOrders.length,
          totalDowntime: `${totalDowntime.toFixed(1)} hours`,
          availableProcedures: assetProcedures,
          lastMaintenance: assetWorkOrders
            .filter(wo => wo.status === 'completed')
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.updated_at,
          nextMaintenance: calculateNextMaintenance(assetWorkOrders),
          healthScore: calculateHealthScore(assetWorkOrders, totalDowntime),
          criticality: asset.criticality || 'medium'
        };
      });
    },
  });
};

function calculateNextMaintenance(workOrders: any[]): string {
  // Simple logic - next PM should be 30 days from last completed maintenance
  const lastCompleted = workOrders
    .filter(wo => wo.status === 'completed' && wo.category === 'PM')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
  
  if (!lastCompleted) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const nextDate = new Date(lastCompleted.updated_at);
  nextDate.setDate(nextDate.getDate() + 30);
  return nextDate.toISOString().split('T')[0];
}

function calculateHealthScore(workOrders: any[], totalDowntime: number): number {
  const recent = workOrders.filter(wo => {
    const woDate = new Date(wo.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return woDate > thirtyDaysAgo;
  });
  
  const baseScore = 100;
  const downtimePenalty = Math.min(totalDowntime * 2, 30);
  const recentIssuesPenalty = recent.length * 5;
  
  return Math.max(baseScore - downtimePenalty - recentIssuesPenalty, 0);
}

export const useCreateWorkOrderForAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ assetId, title, description, priority = 'medium', procedures = [] }: {
      assetId: string;
      title: string;
      description: string;
      priority?: string;
      procedures?: string[];
    }) => {
      const workOrder = await databaseApi.createWorkOrder({
        asset_id: assetId,
        title,
        description,
        priority,
        status: 'open'
      });
      
      // Attach procedures if provided
      if (procedures.length > 0) {
        await Promise.all(procedures.map(procId => 
          databaseApi.attachProcedureToWorkOrder(workOrder.id, procId)
        ));
      }
      
      return workOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["assets-integration"] });
    }
  });
};
