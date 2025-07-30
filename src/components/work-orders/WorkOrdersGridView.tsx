import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ClipboardList, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  PlayCircle,
  Eye
} from 'lucide-react';
import { WorkOrder } from '@/types/workOrder';
import { format } from 'date-fns';

interface WorkOrdersGridViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId: string | null;
  selectedWorkOrders?: string[];
  onWorkOrderSelect?: (workOrderId: string, checked: boolean) => void;
}

export const WorkOrdersGridView = ({
  workOrders,
  onSelectWorkOrder,
  selectedWorkOrderId,
  selectedWorkOrders = [],
  onWorkOrderSelect
}: WorkOrdersGridViewProps) => {
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in-progress':
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'pending':
        return <Circle className="w-4 h-4" />;
      case 'in-progress':
      case 'in_progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'canceled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const calculateProgress = (workOrder: WorkOrder): number => {
    // Simple progress calculation based on status
    switch (workOrder.status?.toLowerCase()) {
      case 'completed':
        return 100;
      case 'in-progress':
      case 'in_progress':
        return 60;
      case 'open':
      case 'pending':
        return 20;
      default:
        return 0;
    }
  };

  const isOverdue = (dueDate: string | Date | null): boolean => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const formatDueDate = (dueDate: string | Date | null): string => {
    if (!dueDate) return 'No due date';
    try {
      return format(new Date(dueDate), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleWorkOrderClick = (workOrder: WorkOrder, event: React.MouseEvent) => {
    // Prevent triggering if clicking on checkbox
    if ((event.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    onSelectWorkOrder(workOrder.id);
  };

  const handleSelectChange = (workOrderId: string, checked: boolean) => {
    if (onWorkOrderSelect) {
      onWorkOrderSelect(workOrderId, checked);
    }
  };

  if (workOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="space-y-3">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">No work orders found</p>
            <p className="text-gray-500">Try adjusting your filters or create a new work order.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {workOrders.map((workOrder) => {
        const progress = calculateProgress(workOrder);
        const overdue = isOverdue(workOrder.dueDate);
        const isSelected = selectedWorkOrderId === workOrder.id;
        const isChecked = selectedWorkOrders.includes(workOrder.id);

        return (
          <Card
            key={workOrder.id}
            className={`
              cursor-pointer transition-all duration-200 hover:shadow-lg border
              ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50/50' : 'hover:shadow-md'}
              ${overdue ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'}
            `}
            onClick={(e) => handleWorkOrderClick(workOrder, e)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header with checkbox and status */}
              <div className="flex items-center justify-between">
                {onWorkOrderSelect && (
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleSelectChange(workOrder.id, !!checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(workOrder.status)}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(workOrder.status)}
                    {workOrder.status}
                  </span>
                </Badge>
              </div>

              {/* Title */}
              <div>
                <h3 className="font-semibold text-gray-900 truncate text-sm" title={workOrder.title}>
                  {workOrder.title}
                </h3>
                {workOrder.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {workOrder.description}
                  </p>
                )}
              </div>

              {/* Priority and Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs px-2 py-1 ${getPriorityColor(workOrder.priority)}`}>
                    {workOrder.priority}
                  </Badge>
                  <span className="text-xs font-medium text-gray-700">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs text-gray-600">
                {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    <span className="truncate">{workOrder.assignedTo[0]}</span>
                  </div>
                )}
                
                {workOrder.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      {typeof workOrder.location === 'string' ? workOrder.location : workOrder.location.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span className={`${overdue ? 'text-red-600 font-medium' : ''}`}>
                    {formatDueDate(workOrder.dueDate)}
                    {overdue && ' (Overdue)'}
                  </span>
                </div>

                {workOrder.timeSpent && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{workOrder.timeSpent}h spent</span>
                  </div>
                )}
              </div>

              {/* Action button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectWorkOrder(workOrder.id);
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};