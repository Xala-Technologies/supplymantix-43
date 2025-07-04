import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, MapPin, Building, Package, Truck } from 'lucide-react';
import { useReporting } from '@/contexts/ReportingContext';

const mockCreatedVsCompletedData = [
  { date: '2024-01-01', created: 12, completed: 8 },
  { date: '2024-01-02', created: 15, completed: 12 },
  { date: '2024-01-03', created: 10, completed: 14 },
  { date: '2024-01-04', created: 18, completed: 10 },
  { date: '2024-01-05', created: 14, completed: 16 },
];

const mockGroupedData = {
  team: [
    { name: 'Maintenance Team A', members: 5, assigned: 45, completed: 38, ratio: 84.4 },
    { name: 'Maintenance Team B', members: 4, assigned: 32, completed: 28, ratio: 87.5 },
    { name: 'Facility Team', members: 3, assigned: 28, completed: 22, ratio: 78.6 },
  ],
  user: [
    { name: 'John Smith', avatar: null, created: 12, assigned: 25, completed: 22, ratio: 88.0 },
    { name: 'Sarah Johnson', avatar: null, created: 8, assigned: 18, completed: 16, ratio: 88.9 },
    { name: 'Mike Wilson', avatar: null, created: 15, assigned: 30, completed: 24, ratio: 80.0 },
  ],
  asset: [
    { name: 'HVAC System #1', location: 'Building A', assigned: 15, completed: 12, ratio: 80.0 },
    { name: 'Generator #2', location: 'Building B', assigned: 8, completed: 8, ratio: 100.0 },
    { name: 'Pump #3', location: 'Basement', assigned: 12, completed: 9, ratio: 75.0 },
  ],
  location: [
    { name: 'Building A', assigned: 35, completed: 28, ratio: 80.0 },
    { name: 'Building B', assigned: 22, completed: 20, ratio: 90.9 },
    { name: 'Basement', assigned: 18, completed: 15, ratio: 83.3 },
  ],
  category: [
    { name: 'Preventive Maintenance', assigned: 45, completed: 42, ratio: 93.3 },
    { name: 'Repairs', assigned: 28, completed: 22, ratio: 78.6 },
    { name: 'Inspections', assigned: 15, completed: 14, ratio: 93.3 },
  ],
  asset_type: [
    { name: 'HVAC', assetCount: 8, assigned: 35, completed: 28, ratio: 80.0 },
    { name: 'Electrical', assetCount: 12, assigned: 22, completed: 20, ratio: 90.9 },
    { name: 'Plumbing', assetCount: 6, assigned: 18, completed: 15, ratio: 83.3 },
  ],
  vendor: [
    { name: 'ABC Maintenance Co.', assigned: 25, completed: 22, ratio: 88.0 },
    { name: 'XYZ Services', assigned: 18, completed: 15, ratio: 83.3 },
    { name: 'Internal Team', assigned: 32, completed: 26, ratio: 81.3 },
  ],
};

type GroupBy = 'team' | 'user' | 'asset' | 'location' | 'category' | 'asset_type' | 'vendor';

export const WorkOrdersReportTab = () => {
  const [groupBy, setGroupBy] = useState<GroupBy>('team');
  const { dateRange, filters } = useReporting();

  const totalCreated = mockCreatedVsCompletedData.reduce((sum, day) => sum + day.created, 0);
  const totalCompleted = mockCreatedVsCompletedData.reduce((sum, day) => sum + day.completed, 0);
  const completionRate = totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 0;

  const groupIcons = {
    team: Users,
    user: Users,
    asset: Building,
    location: MapPin,
    category: Package,
    asset_type: Building,
    vendor: Truck,
  };

  const IconComponent = groupIcons[groupBy];

  const renderGroupedTable = () => {
    const data = mockGroupedData[groupBy] as any[];
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {groupBy.charAt(0).toUpperCase() + groupBy.slice(1).replace('_', ' ')}
              </div>
            </TableHead>
            {groupBy === 'team' && <TableHead>Members</TableHead>}
            {groupBy === 'user' && <TableHead>Created</TableHead>}
            {groupBy === 'asset' && <TableHead>Location</TableHead>}
            {groupBy === 'asset_type' && <TableHead>Assets</TableHead>}
            <TableHead className="text-right">Assigned</TableHead>
            <TableHead className="text-right">Completed</TableHead>
            <TableHead className="text-right">Completion Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              {groupBy === 'team' && <TableCell>{item.members}</TableCell>}
              {groupBy === 'user' && <TableCell>{item.created}</TableCell>}
              {groupBy === 'asset' && <TableCell>{item.location}</TableCell>}
              {groupBy === 'asset_type' && <TableCell>{item.assetCount}</TableCell>}
              <TableCell className="text-right">{item.assigned}</TableCell>
              <TableCell className="text-right">{item.completed}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2">
                  <Progress value={item.ratio} className="w-16" />
                  <span className="text-sm font-medium">{item.ratio}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders Created</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreated}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders Completed</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Badge variant={completionRate >= 80 ? "default" : "secondary"}>
              {completionRate.toFixed(1)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">
              {completionRate >= 80 ? 'Excellent performance' : 'Room for improvement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Created vs Completed Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Created vs Completed Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockCreatedVsCompletedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Created"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grouped Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Work Orders by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1).replace('_', ' ')}</CardTitle>
            <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="asset_type">Asset Type</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {renderGroupedTable()}
        </CardContent>
      </Card>
    </div>
  );
};