
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Calendar,
  DollarSign,
  Target
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersStatsOverviewProps {
  workOrders: WorkOrder[];
}

export const WorkOrdersStatsOverview = ({ workOrders }: WorkOrdersStatsOverviewProps) => {
  // Calculate statistics
  const totalOrders = workOrders.length;
  const completedOrders = workOrders.filter(wo => wo.status === 'completed').length;
  const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
  const overdueOrders = workOrders.filter(wo => 
    wo.due_date && new Date(wo.due_date) < new Date() && wo.status !== 'completed'
  ).length;
  const highPriorityOrders = workOrders.filter(wo => wo.priority === 'high' || wo.priority === 'urgent').length;
  
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const totalCost = workOrders.reduce((sum, wo) => sum + (wo.total_cost || 0), 0);
  const totalTime = workOrders.reduce((sum, wo) => sum + (wo.time_spent || 0), 0);

  const stats = [
    {
      title: "Total",
      value: totalOrders,
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "In Progress",
      value: inProgressOrders,
      icon: Clock,
      color: "text-amber-600"
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Overdue",
      value: overdueOrders,
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "High Priority",
      value: highPriorityOrders,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Total Cost",
      value: `$${totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Hours Logged",
      value: `${totalTime.toFixed(1)}h`,
      icon: Calendar,
      color: "text-indigo-600"
    },
    {
      title: "Completion Rate",
      value: `${Math.round(completionRate)}%`,
      icon: Users,
      color: "text-teal-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </h4>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
