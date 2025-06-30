
import { useQuery } from "@tanstack/react-query";
import { useWorkOrdersIntegration } from "./useWorkOrdersIntegration";

interface DashboardMetrics {
  workOrders: {
    open: number;
    overdue: number;
    completedLastMonth: number;
    avgCompletionTime: number;
    total: number;
  };
  assets: {
    total: number;
    online: number;
    uptime: number;
    critical: number;
  };
  inventory: {
    totalValue: number;
    lowStock: number;
    totalItems: number;
  };
  purchaseOrders: {
    pending: number;
    totalPendingValue: number;
  };
  alerts: Array<{
    type: string;
    message: string;
    action?: string;
  }>;
}

export const useDashboardMetrics = () => {
  const { data: workOrders, isLoading: workOrdersLoading } = useWorkOrdersIntegration();

  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Calculate metrics from real data if available
      const openWorkOrders = workOrders?.filter(wo => wo.status === 'open').length || 0;
      const overdueWorkOrders = workOrders?.filter(wo => {
        if (!wo.due_date) return false;
        return new Date(wo.due_date) < new Date() && wo.status !== 'completed';
      }).length || 0;
      
      const completedWorkOrders = workOrders?.filter(wo => wo.status === 'completed').length || 0;
      const totalWorkOrders = workOrders?.length || 0;

      return {
        workOrders: {
          open: openWorkOrders,
          overdue: overdueWorkOrders,
          completedLastMonth: completedWorkOrders,
          avgCompletionTime: 2.5,
          total: totalWorkOrders
        },
        assets: {
          total: 24,
          online: 22,
          uptime: 92,
          critical: 3
        },
        inventory: {
          totalValue: 125000,
          lowStock: 8,
          totalItems: 156
        },
        purchaseOrders: {
          pending: 5,
          totalPendingValue: 45000
        },
        alerts: [
          { type: 'error', message: 'Work Order #1234 is overdue', action: '/dashboard/work-orders/1234' },
          { type: 'warning', message: 'Hydraulic Oil is low in stock (5 remaining)', action: '/dashboard/inventory' }
        ]
      };
    },
    enabled: !workOrdersLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
