
import { useQuery } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [workOrders, assets, inventory, purchaseOrders] = await Promise.all([
        databaseApi.getWorkOrders(),
        databaseApi.getAssets(),
        databaseApi.getInventoryItems(),
        databaseApi.getPurchaseOrders()
      ]);
      
      // Work Order Metrics
      const openWorkOrders = workOrders.filter(wo => !['completed', 'closed'].includes(wo.status));
      const overdueWorkOrders = openWorkOrders.filter(wo => 
        wo.due_date && new Date(wo.due_date) < new Date()
      );
      const highPriorityWOs = openWorkOrders.filter(wo => (wo.priority || 'medium') === 'high');
      
      // Asset Metrics
      const totalAssets = assets.length;
      const onlineAssets = assets.filter(a => a.status === 'active').length;
      const criticalAssets = assets.filter(a => (a.criticality || 'medium') === 'high').length;
      
      // Inventory Metrics
      const totalInventoryValue = inventory.reduce((sum, item) => 
        sum + ((item.quantity || 0) * (item.unit_cost || 0)), 0
      );
      const lowStockItems = inventory.filter(item => 
        (item.quantity || 0) <= (item.min_quantity || 0)
      );
      const outOfStockItems = inventory.filter(item => (item.quantity || 0) === 0);
      
      // Purchase Order Metrics
      const pendingPOs = purchaseOrders.filter(po => po.status === 'pending');
      const totalPOValue = pendingPOs.reduce((sum, po) => sum + (po.total_amount || 0), 0);
      
      // Maintenance Metrics
      const completedLastMonth = workOrders.filter(wo => {
        if (wo.status !== 'completed') return false;
        const completedDate = new Date(wo.updated_at);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return completedDate > lastMonth;
      });
      
      const avgCompletionTime = completedLastMonth.length > 0 
        ? completedLastMonth.reduce((sum, wo) => {
            const created = new Date(wo.created_at);
            const completed = new Date(wo.updated_at);
            return sum + (completed.getTime() - created.getTime());
          }, 0) / completedLastMonth.length / (1000 * 60 * 60 * 24) // days
        : 0;
      
      return {
        workOrders: {
          total: workOrders.length,
          open: openWorkOrders.length,
          overdue: overdueWorkOrders.length,
          highPriority: highPriorityWOs.length,
          completedLastMonth: completedLastMonth.length,
          avgCompletionTime: Math.round(avgCompletionTime * 10) / 10
        },
        assets: {
          total: totalAssets,
          online: onlineAssets,
          offline: totalAssets - onlineAssets,
          critical: criticalAssets,
          uptime: totalAssets > 0 ? Math.round((onlineAssets / totalAssets) * 100) : 100
        },
        inventory: {
          totalItems: inventory.length,
          totalValue: totalInventoryValue,
          lowStock: lowStockItems.length,
          outOfStock: outOfStockItems.length,
          lowStockItems: lowStockItems.slice(0, 5) // Top 5 for quick view
        },
        purchaseOrders: {
          pending: pendingPOs.length,
          totalPendingValue: totalPOValue,
          needsApproval: pendingPOs.filter(po => po.status === 'pending').length
        },
        alerts: [
          ...overdueWorkOrders.slice(0, 3).map(wo => ({
            type: 'error' as const,
            message: `Work Order #${wo.id} is overdue`,
            action: `/dashboard/work-orders/${wo.id}`
          })),
          ...lowStockItems.slice(0, 3).map(item => ({
            type: 'warning' as const,
            message: `${item.name} is low in stock (${item.quantity} remaining)`,
            action: `/dashboard/inventory`
          })),
          ...highPriorityWOs.slice(0, 2).map(wo => ({
            type: 'info' as const,
            message: `High priority: ${wo.title}`,
            action: `/dashboard/work-orders/${wo.id}`
          }))
        ]
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};
