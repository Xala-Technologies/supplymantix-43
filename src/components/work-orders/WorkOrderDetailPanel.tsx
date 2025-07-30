import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertTriangle, 
  Package,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  Settings,
  Share
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkOrder } from "@/types/workOrder";

interface WorkOrderDetailPanelProps {
  workOrder: WorkOrder | null;
  onClose?: () => void;
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
    icon: AlertTriangle 
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

export const WorkOrderDetailPanel = ({ 
  workOrder, 
  onClose 
}: WorkOrderDetailPanelProps) => {
  if (!workOrder) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Select a work order to view details</p>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[workOrder.status as keyof typeof statusConfig];
  const priorityInfo = priorityConfig[workOrder.priority as keyof typeof priorityConfig];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const isOverdue = workOrder.due_date && new Date(workOrder.due_date) < new Date();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={cn("text-sm", statusInfo?.color)}
            >
              {statusInfo?.label}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn("text-sm", priorityInfo?.color)}
            >
              {priorityInfo?.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Mark as Done
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {workOrder.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Work Order ID: #{workOrder.id?.slice(-6) || 'N/A'}</span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Due Date</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className={cn(isOverdue && "text-red-600")}>
                {formatDate(workOrder.due_date)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Priority</h3>
            <Badge className={cn("text-sm", priorityInfo?.color)}>
              {priorityInfo?.label}
            </Badge>
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Assigned To</h3>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {workOrder.assigned_to?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {workOrder.assigned_to || 'Unassigned'}
              </div>
              <div className="text-xs text-gray-500">
                {workOrder.assigned_to && 'Technician'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {workOrder.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {workOrder.description}
            </div>
          </div>
        )}

        {/* Asset Information */}
        {workOrder.asset && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {typeof workOrder.asset === 'object' ? workOrder.asset?.name : workOrder.asset}
                  </div>
                  <div className="text-xs text-gray-500">Computer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {workOrder.location && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Location</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{typeof workOrder.location === 'object' ? workOrder.location?.name : workOrder.location}</span>
            </div>
          </div>
        )}

        {/* Time Tracking */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Estimated Time</h3>
            <div className="text-sm text-gray-600">
              {workOrder.timeSpent ? `${workOrder.timeSpent}h` : 'Not set'}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Work Type</h3>
            <div className="text-sm text-gray-600">
              {workOrder.category || 'Preventive'}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Created on {formatDate(workOrder.created_at || workOrder.createdAt)}</div>
          {workOrder.updated_at && (
            <div>Last updated on {formatDate(workOrder.updated_at)}</div>
          )}
        </div>

        {/* Comments Section */}
        <Separator />
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Comments</h3>
          <div className="space-y-4">
            {/* Placeholder for comments */}
            <div className="text-sm text-gray-500 text-center py-8">
              No comments yet. Click the Comments button above to add one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};