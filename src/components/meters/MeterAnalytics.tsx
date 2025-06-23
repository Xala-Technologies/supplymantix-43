
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMeters } from "@/hooks/useMeters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, BarChart3, Gauge } from "lucide-react";

export const MeterAnalytics = () => {
  const { data: meters } = useMeters();

  if (!meters || meters.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No meters data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate analytics
  const totalMeters = meters.length;
  const activeMeters = meters.filter(m => m.status === 'active').length;
  const criticalMeters = meters.filter(m => m.status === 'critical').length;
  const warningMeters = meters.filter(m => m.status === 'warning').length;

  // Status distribution for pie chart
  const statusData = [
    { name: 'Active', value: activeMeters, color: '#10B981' },
    { name: 'Warning', value: warningMeters, color: '#F59E0B' },
    { name: 'Critical', value: criticalMeters, color: '#EF4444' },
    { name: 'Inactive', value: totalMeters - activeMeters - warningMeters - criticalMeters, color: '#6B7280' }
  ].filter(item => item.value > 0);

  // Type distribution
  const typeData = meters.reduce((acc, meter) => {
    acc[meter.type] = (acc[meter.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeData).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));

  // Performance metrics
  const metersWithTargets = meters.filter(m => m.target_min || m.target_max);
  const metersInRange = metersWithTargets.filter(m => {
    if (m.target_min && m.current_value < m.target_min) return false;
    if (m.target_max && m.current_value > m.target_max) return false;
    return true;
  });

  const performanceRate = metersWithTargets.length > 0 
    ? Math.round((metersInRange.length / metersWithTargets.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Meters</p>
                <p className="text-2xl font-bold">{totalMeters}</p>
              </div>
              <Gauge className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeMeters}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalMeters + warningMeters}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-blue-600">{performanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Meter Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Active Meters</p>
                  <p className="text-sm text-green-700">{activeMeters} meters operating normally</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">{Math.round((activeMeters / totalMeters) * 100)}%</Badge>
            </div>

            {warningMeters > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Warning Status</p>
                    <p className="text-sm text-yellow-700">{warningMeters} meters need attention</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{warningMeters}</Badge>
              </div>
            )}

            {criticalMeters > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Critical Status</p>
                    <p className="text-sm text-red-700">{criticalMeters} meters require immediate action</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">{criticalMeters}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
