
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkOrder } from '@/types/workOrder';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Pause, 
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';

interface WorkOrdersStatsOverviewProps {
  workOrders: WorkOrder[];
}

export const WorkOrdersStatsOverview = ({ workOrders }: WorkOrdersStatsOverviewProps) => {
  // Calculate stats
  const totalOrders = workOrders.length;
  const openOrders = workOrders.filter(wo => wo.status === 'open').length;
  const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
  const completedOrders = workOrders.filter(wo => wo.status === 'completed').length;
  const onHoldOrders = workOrders.filter(wo => wo.status === 'on_hold').length;
  const highPriorityOrders = workOrders.filter(wo => wo.priority === 'high').length;
  
  // Calculate overdue orders
  const currentDate = new Date();
  const overdueOrders = workOrders.filter(wo => {
    const dueDate = new Date(wo.due_date || wo.dueDate || '');
    return dueDate < currentDate && wo.status !== 'completed';
  }).length;

  // Calculate total cost
  const totalCost = workOrders.reduce((sum, wo) => sum + (wo.total_cost || 0), 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null
    },
    {
      title: 'In Progress',
      value: inProgressOrders,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: null
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: null
    },
    {
      title: 'High Priority',
      value: highPriorityOrders,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: null
    },
    {
      title: 'Overdue',
      value: overdueOrders,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: null,
      urgent: overdueOrders > 0
    },
    {
      title: 'On Hold',
      value: onHoldOrders,
      icon: Pause,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: null
    }
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${stat.urgent ? 'ring-2 ring-red-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.urgent && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                      Urgent
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.title === 'Total Cost' ? `$${stat.value.toLocaleString()}` : stat.value}
                  </p>
                  <p className="text-xs font-medium text-gray-600">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Additional summary info */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>Total Cost: <span className="font-semibold">${totalCost.toLocaleString()}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Active Orders: <span className="font-semibold">{openOrders + inProgressOrders}</span></span>
        </div>
        {overdueOrders > 0 && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">{overdueOrders} orders need immediate attention</span>
          </div>
        )}
      </div>
    </div>
  );
};
