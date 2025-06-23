
import { Card, CardContent } from "@/components/ui/card";
import { KpiCard } from "./KpiCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { WorkOrderStatusChart } from "./WorkOrderStatusChart";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { AlertTriangle, CheckCircle, Clock, Wrench, Package, TrendingUp } from "lucide-react";

interface EnhancedDashboardMetricsProps {
  onCreateWorkOrder: () => void;
  onScheduleProcedure?: () => void;
  onAddAsset?: () => void;
  onInviteUser?: () => void;
}

export const EnhancedDashboardMetrics = ({
  onCreateWorkOrder,
  onScheduleProcedure = () => {},
  onAddAsset = () => {},
  onInviteUser = () => {}
}: EnhancedDashboardMetricsProps) => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const kpiData = [
    {
      title: "Open Work Orders",
      value: metrics.workOrders.open,
      description: `${metrics.workOrders.overdue} overdue`,
      icon: Wrench,
      trend: {
        value: 5,
        isPositive: false
      }
    },
    {
      title: "Completed This Month",  
      value: metrics.workOrders.completedLastMonth,
      description: `Avg ${metrics.workOrders.avgCompletionTime} days`,
      icon: CheckCircle,
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: "Assets Online",
      value: `${metrics.assets.uptime}%`,
      description: `${metrics.assets.online}/${metrics.assets.total} active`,
      icon: Package,
      trend: {
        value: 2,
        isPositive: true
      }
    },
    {
      title: "Total Inventory Value",
      value: `$${metrics.inventory.totalValue.toLocaleString()}`,
      description: `${metrics.inventory.lowStock} items low`,
      icon: TrendingUp,
      trend: {
        value: 8,
        isPositive: true
      }
    }
  ];

  const chartData = [
    { status: 'open', count: metrics.workOrders.open, color: '#3B82F6' },
    { status: 'in_progress', count: Math.floor(metrics.workOrders.open * 0.6), color: '#10B981' },
    { status: 'completed', count: metrics.workOrders.completedLastMonth, color: '#059669' },
    { status: 'on_hold', count: Math.floor(metrics.workOrders.open * 0.1), color: '#F59E0B' }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'work_order' as const,
      title: 'Emergency Repair Completed',
      description: 'Production Line A maintenance finished',
      timestamp: new Date().toISOString(),
      status: 'completed',
      user: 'John Doe'
    },
    {
      id: '2', 
      type: 'procedure' as const,
      title: 'Safety Inspection Started',
      description: 'Daily facility safety check',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress',
      user: 'Safety Team'
    },
    {
      id: '3',
      type: 'asset' as const,
      title: 'New Asset Added',
      description: 'Conveyor Belt #3 registered',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: 'Admin'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Here's what's happening with your maintenance operations today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <WorkOrderStatusChart data={chartData} />
          <ActivityTimeline activities={recentActivities} />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <QuickActionsPanel
            onCreateWorkOrder={onCreateWorkOrder}
            onScheduleProcedure={onScheduleProcedure}
            onAddAsset={onAddAsset}
            onInviteUser={onInviteUser}
          />

          {/* System Alerts */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">System Alerts</h3>
              <div className="space-y-3">
                {metrics.alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">{alert.message}</p>
                    </div>
                  </div>
                ))}
                {metrics.alerts.length === 0 && (
                  <p className="text-sm text-gray-500">No alerts at this time</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
