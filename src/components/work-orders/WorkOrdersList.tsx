
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock, Users, MapPin } from "lucide-react";

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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, h:mm a');
  };

  const todoWorkOrders = workOrders.filter(wo => wo.status !== 'Done');
  const myWorkOrders = todoWorkOrders.slice(0, 4); // First 4 as "assigned to me"
  const teamWorkOrders = todoWorkOrders.slice(4); // Rest as "assigned to teams"

  return (
    <div className="w-full md:w-96 lg:w-[28rem] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="pb-2 border-b-2 border-blue-600">
            <span className="text-blue-600 font-semibold text-sm">To Do</span>
          </div>
          <div className="pb-2">
            <span className="text-gray-500 text-sm">Done</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Sort By: Due Date: Earliest First</span>
          <button className="text-gray-400 hover:text-gray-600 text-sm">↻</button>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Assigned to Me Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Assigned to Me ({myWorkOrders.length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {myWorkOrders.map((workOrder) => (
              <div
                key={workOrder.id}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedWorkOrderId === workOrder.id 
                    ? "bg-blue-50 border-blue-300 shadow-sm" 
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectWorkOrder(workOrder.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🔧</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Title and Priority */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight pr-2">
                        {workOrder.title}
                      </h4>
                      <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getPriorityColor(workOrder.priority))} />
                    </div>
                    
                    {/* Asset and ID */}
                    <div className="text-xs text-gray-600 mb-2 truncate">
                      {workOrder.asset.name} • #{workOrder.id}
                    </div>
                    
                    {/* Status and Due Date */}
                    <div className="flex flex-col gap-2 mb-3">
                      <Badge className={cn("text-xs w-fit border", getStatusColor(workOrder.status))}>
                        {workOrder.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDueDate(workOrder.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{workOrder.location}</span>
                      </div>
                    </div>
                    
                    {/* Assigned Users */}
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <div className="flex items-center gap-1">
                        {workOrder.assignedTo.slice(0, 3).map((assignee, index) => (
                          <Avatar key={index} className="w-6 h-6 border border-white">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                              {getInitials(assignee)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {workOrder.assignedTo.length > 3 && (
                          <span className="text-xs text-gray-500 ml-1">+{workOrder.assignedTo.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Assigned to Teams Section */}
        {teamWorkOrders.length > 0 && (
          <div className="px-4 pb-4">
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Assigned to My Teams ({teamWorkOrders.length})
              </h3>
              
              <div className="space-y-3">
                {teamWorkOrders.map((workOrder) => (
                  <div
                    key={workOrder.id}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onSelectWorkOrder(workOrder.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs">
                          {workOrder.category === 'Safety' ? '🔥' : '🔧'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                          {workOrder.title}
                        </h4>
                        <div className="text-xs text-gray-600 mb-2 truncate">
                          {workOrder.asset.name} • #{workOrder.id}
                        </div>
                        <Badge className={cn("text-xs", getStatusColor(workOrder.status))}>
                          {workOrder.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
