
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  FileText, 
  Calendar, 
  Users, 
  Settings,
  BarChart3,
  Filter,
  Download
} from "lucide-react";

interface WorkOrdersQuickActionsProps {
  onCreateWorkOrder: () => void;
}

export const WorkOrdersQuickActions = ({ onCreateWorkOrder }: WorkOrdersQuickActionsProps) => {
  const quickActions = [
    {
      title: "Create Work Order",
      description: "Start a new maintenance task",
      icon: Plus,
      color: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
      onClick: onCreateWorkOrder
    },
    {
      title: "Templates",
      description: "Use predefined templates",
      icon: FileText,
      color: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700",
      onClick: () => console.log("Templates")
    },
    {
      title: "Schedule",
      description: "View work order calendar",
      icon: Calendar,
      color: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      onClick: () => console.log("Schedule")
    },
    {
      title: "Reports",
      description: "Generate analytics",
      icon: BarChart3,
      color: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
      onClick: () => console.log("Reports")
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-700 text-center">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} h-auto p-4 flex-col space-y-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-center">
                <div className="text-xs font-semibold">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="pt-3 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
