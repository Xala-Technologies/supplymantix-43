
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkOrder } from '@/types/workOrder';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Pause, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

interface WorkOrdersMetricsProps {
  workOrders: WorkOrder[];
}

export const WorkOrdersMetrics = ({ workOrders }: WorkOrdersMetricsProps) => {
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

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Calendar,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: null
    },
    {
      title: 'In Progress',
      value: inProgressOrders,
      icon: Activity,
      gradient: 'from-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50',
      change: null
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      change: null
    },
    {
      title: 'High Priority',
      value: highPriorityOrders,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      change: null
    },
    {
      title: 'Overdue',
      value: overdueOrders,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      change: null,
      urgent: overdueOrders > 0
    },
    {
      title: 'On Hold',
      value: onHoldOrders,
      icon: Pause,
      gradient: 'from-gray-500 to-slate-500',
      bgGradient: 'from-gray-50 to-slate-50',
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${
              stat.urgent ? 'ring-2 ring-red-200 animate-pulse' : ''
            }`}
          >
            <CardContent className="p-6 relative">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.urgent && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-bounce">
                      Alert
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
