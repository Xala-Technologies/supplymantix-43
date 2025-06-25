
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Clock, Users, MapPin, Search } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { getStatusColor, getPriorityColor, formatDueDate } from "@/services/workOrderService";
import { getAssetName, getLocationName } from '@/utils/assetUtils';
import { ScrollArea } from "@/components/ui/scroll-area";

interface EnhancedWorkOrdersListProps {
  workOrders: WorkOrder[];
  selectedWorkOrderId: string | null;
  onSelectWorkOrder: (id: string) => void;
}

export const EnhancedWorkOrdersList = ({ 
  workOrders, 
  selectedWorkOrderId, 
  onSelectWorkOrder
}: EnhancedWorkOrdersListProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Work Orders List */}
      <div className="flex-1 overflow-hidden">
        {workOrders.length > 0 ? (
          <ScrollArea className="h-full w-full">
            <div className="p-3 space-y-2 pr-6">
              {workOrders.map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  isSelected={selectedWorkOrderId === workOrder.id}
                  onClick={() => onSelectWorkOrder(workOrder.id)}
                  getInitials={getInitials}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No work orders found</h3>
              <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  isSelected: boolean;
  onClick: () => void;
  getInitials: (name: string) => string;
}

const WorkOrderCard = ({ workOrder, isSelected, onClick, getInitials }: WorkOrderCardProps) => {
  const isOverdue = new Date(workOrder.dueDate || workOrder.due_date || '') < new Date() && workOrder.status !== 'completed';
  
  return (
    <div
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-blue-50 border-blue-200 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
        isOverdue && "ring-1 ring-red-200"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", getPriorityColor(workOrder.priority))} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-0.5">
              {workOrder.title}
            </h4>
            <p className="text-xs text-gray-600">
              {getAssetName(workOrder.asset)} • #{workOrder.id.slice(-4)}
            </p>
          </div>
        </div>
        
        {/* Status and Due Date */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs h-5 px-2", getStatusColor(workOrder.status))}>
            {workOrder.status.replace('_', ' ')}
          </Badge>
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-red-600" : "text-gray-500"
          )}>
            <Clock className="w-3 h-3" />
            <span>{formatDueDate(workOrder.dueDate || workOrder.due_date || '')}</span>
            {isOverdue && <span className="text-red-600">⚠️</span>}
          </div>
        </div>
        
        {/* Location and Assignees */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{getLocationName(workOrder.location)}</span>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Users className="w-3 h-3 text-gray-400" />
            {workOrder.assignedTo.slice(0, 2).map((assignee, index) => (
              <Avatar key={index} className="w-4 h-4 border border-white">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                  {getInitials(assignee)}
                </AvatarFallback>
              </Avatar>
            ))}
            {workOrder.assignedTo.length > 2 && (
              <span className="text-gray-500 ml-0.5">+{workOrder.assignedTo.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
