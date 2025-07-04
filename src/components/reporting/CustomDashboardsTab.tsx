import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Layout, 
  BarChart3, 
  PieChart, 
  Users, 
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'progress';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
}

interface CustomDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: Widget[];
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

const availableWidgets = [
  {
    id: 'created-vs-completed',
    name: 'Created vs Completed',
    type: 'chart',
    icon: TrendingUp,
    description: 'Line chart showing work orders created vs completed over time',
  },
  {
    id: 'completion-rate',
    name: 'Completion Rate',
    type: 'metric',
    icon: Activity,
    description: 'Current work order completion percentage',
  },
  {
    id: 'wo-by-type',
    name: 'Work Orders by Type',
    type: 'chart',
    icon: PieChart,
    description: 'Pie chart breakdown of work orders by category',
  },
  {
    id: 'status-distribution',
    name: 'Status Distribution',
    type: 'chart',
    icon: BarChart3,
    description: 'Bar chart of work orders by status',
  },
  {
    id: 'team-performance',
    name: 'Team Performance',
    type: 'table',
    icon: Users,
    description: 'Table showing team completion statistics',
  },
  {
    id: 'upcoming-maintenance',
    name: 'Upcoming Maintenance',
    type: 'table',
    icon: Calendar,
    description: 'List of scheduled maintenance activities',
  },
];

export const CustomDashboardsTab = () => {
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([
    {
      id: '1',
      name: 'Executive Overview',
      description: 'High-level metrics for management',
      widgets: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isDefault: true,
    },
    {
      id: '2',
      name: 'Operations Dashboard',
      description: 'Detailed view for operations team',
      widgets: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<CustomDashboard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDescription, setNewDashboardDescription] = useState('');

  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) return;

    const newDashboard: CustomDashboard = {
      id: Date.now().toString(),
      name: newDashboardName,
      description: newDashboardDescription,
      widgets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDashboards(prev => [...prev, newDashboard]);
    setNewDashboardName('');
    setNewDashboardDescription('');
    setIsCreating(false);
    setSelectedDashboard(newDashboard);
  };

  const handleCloneDashboard = (dashboard: CustomDashboard) => {
    const clonedDashboard: CustomDashboard = {
      ...dashboard,
      id: Date.now().toString(),
      name: `${dashboard.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false,
    };

    setDashboards(prev => [...prev, clonedDashboard]);
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    if (selectedDashboard?.id === dashboardId) {
      setSelectedDashboard(null);
    }
  };

  const addWidgetToDashboard = (widgetType: any) => {
    if (!selectedDashboard) return;

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type: widgetType.type,
      title: widgetType.name,
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: { widgetId: widgetType.id },
    };

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: [...selectedDashboard.widgets, newWidget],
      updatedAt: new Date(),
    };

    setDashboards(prev => prev.map(d => d.id === selectedDashboard.id ? updatedDashboard : d));
    setSelectedDashboard(updatedDashboard);
  };

  return (
    <div className="space-y-6">
      {!selectedDashboard ? (
        // Dashboard List View
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Custom Dashboards</h2>
              <p className="text-muted-foreground">Create and manage personalized reporting dashboards</p>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Dashboard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Dashboard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-name">Dashboard Name</Label>
                    <Input
                      id="dashboard-name"
                      value={newDashboardName}
                      onChange={(e) => setNewDashboardName(e.target.value)}
                      placeholder="Enter dashboard name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-description">Description (Optional)</Label>
                    <Input
                      id="dashboard-description"
                      value={newDashboardDescription}
                      onChange={(e) => setNewDashboardDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDashboard} disabled={!newDashboardName.trim()}>
                      Create Dashboard
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Card key={dashboard.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        {dashboard.name}
                        {dashboard.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </CardTitle>
                      {dashboard.description && (
                        <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {dashboard.widgets.length} widgets • Last updated {dashboard.updatedAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedDashboard(dashboard)}
                      >
                        Open Dashboard
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleCloneDashboard(dashboard)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!dashboard.isDefault && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteDashboard(dashboard.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        // Dashboard Builder View
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setSelectedDashboard(null)}>
                ← Back to Dashboards
              </Button>
              <div>
                <h2 className="text-2xl font-bold">{selectedDashboard.name}</h2>
                {selectedDashboard.description && (
                  <p className="text-muted-foreground">{selectedDashboard.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Layout
              </Button>
              <Button variant="outline">Save Changes</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Widget Library */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Available Widgets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableWidgets.map((widget) => (
                    <div 
                      key={widget.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => addWidgetToDashboard(widget)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <widget.icon className="h-4 w-4" />
                        <span className="font-medium">{widget.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{widget.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Canvas */}
            <div className="lg:col-span-3">
              <Card className="min-h-[600px]">
                <CardContent className="p-6">
                  {selectedDashboard.widgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <Layout className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Dashboard</h3>
                      <p className="text-gray-500 mb-4">
                        Add widgets from the library to start building your custom dashboard
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDashboard.widgets.map((widget) => (
                        <Card key={widget.id} className="relative group">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{widget.title}</CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const updatedDashboard = {
                                    ...selectedDashboard,
                                    widgets: selectedDashboard.widgets.filter(w => w.id !== widget.id),
                                  };
                                  setSelectedDashboard(updatedDashboard);
                                  setDashboards(prev => prev.map(d => d.id === selectedDashboard.id ? updatedDashboard : d));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground">Widget Preview</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};