import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const assetStatusData = [
  { name: 'Operational', value: 142, color: 'hsl(var(--chart-1))' },
  { name: 'Maintenance', value: 18, color: 'hsl(var(--chart-2))' },
  { name: 'Out of Service', value: 5, color: 'hsl(var(--chart-3))' },
];

const assetHealthScore = [
  { category: 'HVAC Systems', score: 92, trend: 'up' },
  { category: 'Electrical', score: 88, trend: 'stable' },
  { category: 'Plumbing', score: 85, trend: 'down' },
  { category: 'Safety Equipment', score: 95, trend: 'up' },
  { category: 'Manufacturing', score: 78, trend: 'down' },
];

const maintenanceSchedule = [
  { asset: 'HVAC Unit #1', nextMaintenance: '2024-01-15', status: 'scheduled', priority: 'medium' },
  { asset: 'Generator #2', nextMaintenance: '2024-01-12', status: 'overdue', priority: 'high' },
  { asset: 'Pump #3', nextMaintenance: '2024-01-20', status: 'scheduled', priority: 'low' },
  { asset: 'Compressor #4', nextMaintenance: '2024-01-18', status: 'scheduled', priority: 'medium' },
];

const uptimeData = [
  { month: 'Jan', uptime: 98.5 },
  { month: 'Feb', uptime: 97.2 },
  { month: 'Mar', uptime: 99.1 },
  { month: 'Apr', uptime: 96.8 },
  { month: 'May', uptime: 98.9 },
  { month: 'Jun', uptime: 99.3 },
];

export const AssetHealthTab = () => {
  const totalAssets = assetStatusData.reduce((sum, item) => sum + item.value, 0);
  const operationalRate = (assetStatusData[0].value / totalAssets) * 100;
  const avgHealthScore = assetHealthScore.reduce((sum, item) => sum + item.score, 0) / assetHealthScore.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalRate.toFixed(1)}%</div>
            <Progress value={operationalRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHealthScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">+2.3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceSchedule.filter(item => item.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {assetStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Uptime Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Uptime Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[95, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Uptime']} />
                <Bar dataKey="uptime" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Asset Health Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Health Scores by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Health Score</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetHealthScore.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="w-20" />
                      <span className="text-sm font-medium">{item.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                      {item.trend}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.score >= 90 ? 'default' : item.score >= 80 ? 'secondary' : 'destructive'}>
                      {item.score >= 90 ? 'Excellent' : item.score >= 80 ? 'Good' : 'Needs Attention'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceSchedule.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.asset}</TableCell>
                  <TableCell>{item.nextMaintenance}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};