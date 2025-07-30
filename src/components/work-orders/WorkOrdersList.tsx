import React from 'react';
import { WorkOrder } from '@/features/workOrders/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  onSelectWorkOrder: (id: string) => void;
}

export const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  workOrders,
  selectedWorkOrder,
  onSelectWorkOrder
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'open':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'urgent':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const isOverdue = (dueDate: string | Date | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Work Orders</h2>
        <p className="text-sm text-muted-foreground">{workOrders.length} total</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {workOrders.map((workOrder) => {
            const isSelected = selectedWorkOrder === workOrder.id;
            const workOrderDueDate = workOrder.dueDate || workOrder.due_date;
            const isWorkOrderOverdue = isOverdue(workOrderDueDate);
            
            return (
              <div
                key={workOrder.id}
                onClick={() => onSelectWorkOrder(workOrder.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  isSelected 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:bg-accent/50",
                  isWorkOrderOverdue && "border-l-4 border-l-red-500"
                )}
              >
                <div className="space-y-3">
                  {/* Header with status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {workOrder.title || 'Untitled Work Order'}
                      </h3>
                      {workOrder.asset?.name && (
                        <p className="text-xs text-muted-foreground truncate">
                          {workOrder.asset.name}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs ml-2 flex-shrink-0", getStatusColor(workOrder.status))}
                    >
                      {workOrder.status || 'draft'}
                    </Badge>
                  </div>

                  {/* Priority and overdue indicator */}
                  <div className="flex items-center gap-2">
                    {workOrder.priority && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getPriorityColor(workOrder.priority))}
                      >
                        {workOrder.priority}
                      </Badge>
                    )}
                    {isWorkOrderOverdue && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">Overdue</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    {workOrder.assignedTo?.length && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span className="truncate">{workOrder.assignedTo.join(', ')}</span>
                      </div>
                    )}
                    
                    {workOrder.location?.name && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{workOrder.location.name}</span>
                      </div>
                    )}
                    
                    {workOrderDueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Due {formatDate(workOrderDueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};