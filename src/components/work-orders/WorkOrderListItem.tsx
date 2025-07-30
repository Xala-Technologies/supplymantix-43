import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, User, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkOrder } from "@/types/workOrder";

interface WorkOrderListItemProps {
  workOrder: WorkOrder;
  isSelected?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  open: { 
    label: "To Do", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock 
  },
  in_progress: { 
    label: "In Progress", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle 
  },
  completed: { 
    label: "Done", 
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle 
  },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-800" },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
};

export const WorkOrderListItem = ({ 
  workOrder, 
  isSelected = false, 
  onClick 
}: WorkOrderListItemProps) => {
  const statusInfo = statusConfig[workOrder.status as keyof typeof statusConfig];
  const priorityInfo = priorityConfig[workOrder.priority as keyof typeof priorityConfig];
  const StatusIcon = statusInfo?.icon || Clock;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const isOverdue = workOrder.due_date && new Date(workOrder.due_date) < new Date();

  return (
    <div
      className={cn(
        "p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900 text-sm">
            {workOrder.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {isOverdue && (
            <span className="text-red-500 text-xs font-medium">Overdue</span>
          )}
          <Badge 
            variant="secondary" 
            className={cn("text-xs", priorityInfo?.color)}
          >
            {priorityInfo?.label}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {workOrder.due_date && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>Due {formatDate(workOrder.due_date)}</span>
          </div>
        )}

        {workOrder.location && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{typeof workOrder.location === 'object' ? workOrder.location?.name : workOrder.location}</span>
          </div>
        )}

        {workOrder.assigned_to && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>Assigned to {workOrder.assigned_to}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <Badge 
          variant="outline" 
          className={cn("text-xs", statusInfo?.color)}
        >
          {statusInfo?.label}
        </Badge>
        
        <span className="text-xs text-gray-500">
          #{workOrder.id?.slice(-6) || 'N/A'}
        </span>
      </div>
    </div>
  );
};