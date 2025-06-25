
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Edit, 
  MoreHorizontal, 
  Clock, 
  User, 
  Calendar, 
  MapPin,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  Lock,
  Unlock,
  Eye
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WorkOrderDetailPanelProps {
  workOrder: WorkOrder;
  onEdit: () => void;
  onStatusUpdate: (status: string) => void;
}

export const WorkOrderDetailPanel = ({ 
  workOrder, 
  onEdit, 
  onStatusUpdate 
}: WorkOrderDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState('details');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusActions = () => {
    const actions = [];
    const status = workOrder.status.toLowerCase();

    if (status === 'open') {
      actions.push(
        { icon: Play, label: 'In Progress', value: 'in_progress', color: 'bg-blue-600' }
      );
    }
    
    if (status === 'in_progress') {
      actions.push(
        { icon: Pause, label: 'On Hold', value: 'on_hold', color: 'bg-yellow-600' },
        { icon: CheckCircle, label: 'Done', value: 'completed', color: 'bg-green-600' }
      );
    }
    
    if (status === 'on_hold') {
      actions.push(
        { icon: Play, label: 'In Progress', value: 'in_progress', color: 'bg-blue-600' }
      );
    }

    return actions;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {workOrder.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-2 mb-4">
          {getStatusActions().map((action) => (
            <Button
              key={action.value}
              size="sm"
              onClick={() => onStatusUpdate(action.value)}
              className={cn("gap-2 text-white", action.color)}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Status Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Due Date</div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {workOrder.dueDate 
                  ? format(new Date(workOrder.dueDate), 'MMM d, h:mm a')
                  : 'Not set'
                }
              </span>
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Estimated Time</div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{workOrder.timeSpent || 0}h</span>
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Priority</div>
            <div className={cn("font-medium", getPriorityColor(workOrder.priority))}>
              {workOrder.priority}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Work Order ID</div>
            <div className="font-mono">#{workOrder.id.slice(-6)}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Users Assigned */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Users Assigned</h3>
            <div className="flex items-center gap-2">
              {workOrder.assignedTo.length > 0 ? (
                workOrder.assignedTo.map((user, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-sm">{user}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No users assigned</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {workOrder.description || 'No description provided.'}
            </p>
          </div>

          {/* Asset Information */}
          {workOrder.asset && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Asset</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {typeof workOrder.asset === 'string' ? workOrder.asset : workOrder.asset.name}
                  </div>
                  <div className="text-xs text-gray-500">Equipment</div>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {workOrder.location && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Location</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {typeof workOrder.location === 'string' ? workOrder.location : workOrder.location.name}
                </span>
              </div>
            </div>
          )}

          {/* Attached Files */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Attached Files</h3>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View Procedure
              </Button>
              <div className="text-sm text-gray-500">
                <span>CSP - Manual.pdf</span>
                <span className="ml-2">Procedure.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
