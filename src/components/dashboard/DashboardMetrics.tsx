
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { AlertTriangle, CheckCircle, Clock, DollarSign, Package, Settings, TrendingUp, TrendingDown } from "lucide-react";

export const DashboardMetrics = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Work Orders */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.workOrders.open}</div>
                <p className="text-xs text-gray-500">of {metrics.workOrders.total} total</p>
              </div>
              <div className="text-right">
                {metrics.workOrders.overdue > 0 && (
                  <Badge variant="destructive" className="mb-1">
                    {metrics.workOrders.overdue} overdue
                  </Badge>
                )}
                <Link to="/dashboard/work-orders">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Asset Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.assets.uptime}%</div>
                <p className="text-xs text-gray-500">{metrics.assets.online} of {metrics.assets.total} online</p>
              </div>
              <div className="text-right">
                <Link to="/dashboard/assets">
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(metrics.inventory.totalValue / 1000).toFixed(0)}k
                </div>
                <p className="text-xs text-gray-500">{metrics.inventory.totalItems} items</p>
              </div>
              <div className="text-right">
                {metrics.inventory.lowStock > 0 && (
                  <Badge variant="outline" className="mb-1 text-yellow-700 border-yellow-300">
                    {metrics.inventory.lowStock} low stock
                  </Badge>
                )}
                <Link to="/dashboard/inventory">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{metrics.purchaseOrders.pending}</div>
                <p className="text-xs text-gray-500">pending approval</p>
              </div>
              <div className="text-right">
                <Link to="/dashboard/purchase-orders">
                  <Button variant="ghost" size="sm">Review</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.alerts.length > 0 ? (
              <div className="space-y-3">
                {metrics.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {alert.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {alert.type === 'warning' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {alert.type === 'info' && <TrendingUp className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                    <Link to={alert.action}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>No active alerts</p>
                <p className="text-xs">Everything looks good!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Completion Time</span>
                <span className="font-semibold">{metrics.workOrders.avgCompletionTime} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Last Month</span>
                <span className="font-semibold">{metrics.workOrders.completedLastMonth} work orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Critical Assets</span>
                <span className="font-semibold">{metrics.assets.critical} monitored</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending PO Value</span>
                <span className="font-semibold">${(metrics.purchaseOrders.totalPendingValue / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => navigate('/dashboard/work-orders')} className="w-full" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              New Work Order
            </Button>
            <Button onClick={() => navigate('/dashboard/assets')} className="w-full" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
            {metrics.inventory.lowStock > 0 && (
              <Button onClick={() => navigate('/dashboard/purchase-orders/create')} className="w-full" variant="outline">
                <TrendingDown className="w-4 h-4 mr-2" />
                Create Reorder PO
              </Button>
            )}
            <Button onClick={() => navigate('/dashboard/procedures')} className="w-full" variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              New Procedure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
