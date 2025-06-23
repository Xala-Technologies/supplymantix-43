
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  Calendar, 
  BarChart3
} from "lucide-react";

interface WorkOrdersQuickActionsProps {
  onCreateWorkOrder: () => void;
}

export const WorkOrdersQuickActions = ({ onCreateWorkOrder }: WorkOrdersQuickActionsProps) => {
  const quickActions = [
    {
      title: "Create Work Order",
      description: "Start a new task",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: onCreateWorkOrder
    },
    {
      title: "Templates",
      description: "Use templates",
      icon: FileText,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => console.log("Templates")
    },
    {
      title: "Schedule",
      description: "View calendar",
      icon: Calendar,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => console.log("Schedule")
    },
    {
      title: "Reports",
      description: "View analytics",
      icon: BarChart3,
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => console.log("Reports")
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 text-center">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} h-auto p-4 flex-col space-y-2 text-white shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-center">
                <div className="text-xs font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
