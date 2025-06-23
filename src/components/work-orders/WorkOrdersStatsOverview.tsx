
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { cn } from "@/lib/utils";

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
      title: "Total Orders",
      value: totalOrders,
      icon: Target,
      color: "blue",
      trend: "+12% from last month"
    },
    {
      title: "In Progress",
      value: inProgressOrders,
      icon: Clock,
      color: "amber",
      trend: `${inProgressOrders}/${totalOrders} active`
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle,
      color: "emerald",
      trend: `${completionRate.toFixed(1)}% completion rate`
    },
    {
      title: "Overdue",
      value: overdueOrders,
      icon: AlertTriangle,
      color: "red",
      trend: overdueOrders === 0 ? "All on track" : "Needs attention"
    },
    {
      title: "High Priority",
      value: highPriorityOrders,
      icon: TrendingUp,
      color: "orange",
      trend: `${((highPriorityOrders / totalOrders) * 100).toFixed(1)}% of total`
    },
    {
      title: "Total Cost",
      value: `$${totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: "purple",
      trend: "This period"
    },
    {
      title: "Total Hours",
      value: `${totalTime.toFixed(1)}h`,
      icon: Calendar,
      color: "indigo",
      trend: "Time logged"
    },
    {
      title: "Efficiency",
      value: `${Math.round(completionRate)}%`,
      icon: Users,
      color: "teal",
      trend: "Overall performance"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-cyan-500 text-white",
      amber: "from-amber-500 to-orange-500 text-white",
      emerald: "from-emerald-500 to-green-500 text-white",
      red: "from-red-500 to-pink-500 text-white",
      orange: "from-orange-500 to-red-500 text-white",
      purple: "from-purple-500 to-violet-500 text-white",
      indigo: "from-indigo-500 to-blue-500 text-white",
      teal: "from-teal-500 to-emerald-500 text-white"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-slate-200/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn(
                  "p-2 rounded-xl bg-gradient-to-br shadow-sm",
                  getColorClasses(stat.color)
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </h4>
                <p className="text-xs text-slate-500">{stat.trend}</p>
              </div>
              
              {/* Progress bar for completion rate */}
              {stat.title === "Completed" && (
                <div className="mt-3">
                  <Progress value={completionRate} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
