
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkOrder } from '@/types/workOrder';
import { getStatusColor, getPriorityColor, formatDueDate } from '@/services/workOrderService';

interface WorkOrdersCardViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId?: string | null;
}

export const WorkOrdersCardView = ({ 
  workOrders, 
  onSelectWorkOrder, 
  selectedWorkOrderId 
}: WorkOrdersCardViewProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAssetName = (workOrder: WorkOrder): string => {
    // Check if we have asset data from the database join (assets object from DB)
    if (workOrder.assets && typeof workOrder.assets === 'object' && 'name' in workOrder.assets) {
      return workOrder.assets.name;
    }
    
    // Check if we have asset data from the database join (asset object)
    if (workOrder.asset && typeof workOrder.asset === 'object' && 'name' in workOrder.asset) {
      return workOrder.asset.name;
    }
    
    // Fallback to asset field if it's a string
    if (workOrder.asset && typeof workOrder.asset === 'string') {
      return workOrder.asset;
    }
    
    return 'No Asset';
  };

  const getLocationName = (workOrder: WorkOrder): string => {
    // Check if we have location data from the database join
    if (workOrder.location && typeof workOrder.location === 'object' && 'name' in workOrder.location) {
      return workOrder.location.name;
    }
    
    // Fallback if location is a string
    if (typeof workOrder.location === 'string') {
      return workOrder.location;
    }
    
    return 'No Location';
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workOrders.map((workOrder) => {
          const isSelected = selectedWorkOrderId === workOrder.id;
          const isOverdue = new Date(workOrder.dueDate || workOrder.due_date || '') < new Date() && workOrder.status !== 'completed';
          
          return (
            <Card
              key={workOrder.id}
              className={cn(
                "group cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:border-gray-300",
                isSelected && "ring-2 ring-blue-500 border-blue-200",
                isOverdue && "border-red-200"
              )}
              onClick={() => onSelectWorkOrder(workOrder.id)}
            >
              <CardContent className="p-6">
                {/* Header with Priority Indicator */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getPriorityColor(workOrder.priority))} />
                    {isOverdue && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <Badge className={cn("text-xs", getStatusColor(workOrder.status))}>
                    {workOrder.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Title and Asset */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-2">
                    {workOrder.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getAssetName(workOrder)} • #{workOrder.id.slice(-4)}
                  </p>
                </div>

                {/* Description */}
                {workOrder.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {workOrder.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={cn(
                      isOverdue ? "text-red-600 font-medium" : "text-gray-600"
                    )}>
                      {formatDueDate(workOrder.dueDate || workOrder.due_date || '')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{getLocationName(workOrder)}</span>
                  </div>
                </div>

                {/* Assignees */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-1">
                      {workOrder.assignedTo?.slice(0, 3).map((assignee, index) => (
                        <Avatar key={index} className="w-6 h-6 border border-white">
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
                  
                  <div className="text-xs text-gray-500 capitalize">
                    {workOrder.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
