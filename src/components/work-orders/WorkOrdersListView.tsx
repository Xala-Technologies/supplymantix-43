
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Users, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkOrder } from '@/types/workOrder';
import { getStatusColor, getPriorityColor, formatDueDate } from '@/services/workOrderService';
import { getAssetName, getLocationName } from '@/utils/assetUtils';

interface WorkOrdersListViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId?: string | null;
}

export const WorkOrdersListView = ({ 
  workOrders, 
  onSelectWorkOrder, 
  selectedWorkOrderId 
}: WorkOrdersListViewProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="divide-y divide-gray-100">
      {workOrders.map((workOrder) => {
        const isSelected = selectedWorkOrderId === workOrder.id;
        const isOverdue = new Date(workOrder.dueDate || workOrder.due_date || '') < new Date() && workOrder.status !== 'completed';
        
        return (
          <div
            key={workOrder.id}
            className={cn(
              "p-6 cursor-pointer transition-all duration-200",
              "hover:bg-gray-50",
              isSelected && "bg-blue-50 border-l-4 border-blue-500",
              isOverdue && "bg-red-50"
            )}
            onClick={() => onSelectWorkOrder(workOrder.id)}
          >
            <div className="flex items-start gap-4">
              {/* Priority and Status Indicators */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={cn("w-3 h-3 rounded-full", getPriorityColor(workOrder.priority))} />
                {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight pr-4">
                    {workOrder.title}
                  </h3>
                  <Badge className={cn("text-xs flex-shrink-0", getStatusColor(workOrder.status))}>
                    {workOrder.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Asset and ID */}
                <div className="text-sm text-gray-600 mb-3">
                  {getAssetName(workOrder.asset)} • #{workOrder.id.slice(-4)} • {workOrder.category}
                </div>

                {/* Description */}
                {workOrder.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {workOrder.description}
                  </p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className={cn(
                      isOverdue ? "text-red-600 font-medium" : "text-gray-600"
                    )}>
                      {formatDueDate(workOrder.dueDate || workOrder.due_date || '')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{getLocationName(workOrder.location)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex items-center gap-1 min-w-0">
                      {workOrder.assignedTo?.slice(0, 3).map((assignee, index) => (
                        <Avatar key={index} className="w-5 h-5 border border-white">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                            {getInitials(assignee)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {workOrder.assignedTo && workOrder.assignedTo.length > 3 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{workOrder.assignedTo.length - 3}
                        </span>
                      )}
                      {(!workOrder.assignedTo || workOrder.assignedTo.length === 0) && (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
