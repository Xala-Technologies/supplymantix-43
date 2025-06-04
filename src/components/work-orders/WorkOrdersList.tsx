
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WorkOrder {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  priority: string;
  assignedTo: string[];
  description: string;
  asset: {
    name: string;
    status: string;
  };
  location: string;
  category: string;
}

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  selectedWorkOrderId: string | null;
  onSelectWorkOrder: (id: string) => void;
}

export const WorkOrdersList = ({ workOrders, selectedWorkOrderId, onSelectWorkOrder }: WorkOrdersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'open':
        return 'bg-gray-100 text-gray-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const todoWorkOrders = workOrders.filter(wo => wo.status !== 'Done');
  const doneWorkOrders = workOrders.filter(wo => wo.status === 'Done');

  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4 border-b">
          <div className="pb-2 border-b-2 border-blue-600">
            <span className="text-blue-600 font-medium">To Do</span>
          </div>
          <div className="pb-2">
            <span className="text-gray-500">Done</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sort By: Due Date: Earliest First</span>
            <button className="text-gray-400 hover:text-gray-600">↻</button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Assigned to Me ({todoWorkOrders.length})
          </div>
        </div>
        
        <div className="space-y-2">
          {todoWorkOrders.map((workOrder) => (
            <div
              key={workOrder.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                selectedWorkOrderId === workOrder.id 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => onSelectWorkOrder(workOrder.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs">🔧</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {workOrder.title}
                    </h3>
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(workOrder.priority))} />
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    {workOrder.asset.name} • #{workOrder.id}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={cn("text-xs", getStatusColor(workOrder.status))}>
                      {workOrder.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{workOrder.priority}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {workOrder.assignedTo.slice(0, 3).map((assignee, index) => (
                      <Avatar key={index} className="w-5 h-5">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {getInitials(assignee)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {workOrder.assignedTo.length > 3 && (
                      <span className="text-xs text-gray-500">+{workOrder.assignedTo.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Assigned to My Teams (16)
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border bg-white">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs">🔧</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Weekly Compressor PM</h3>
                  <div className="text-xs text-gray-500">35-005 - Air Compressor - VSS Single Screw • #5988</div>
                  <Badge className="text-xs bg-gray-100 text-gray-800 mt-1">Open</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border bg-white">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs">🔥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Fire Extinguisher Inspection</h3>
                  <div className="text-xs text-gray-500">ABC Fire Extinguisher (5 lb) • #5982</div>
                  <Badge className="text-xs bg-gray-100 text-gray-800 mt-1">Open</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
