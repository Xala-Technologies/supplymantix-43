import React from 'react';
import { WorkOrder } from '@/features/workOrders/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  FileText, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Circle,
  Play
} from 'lucide-react';

interface WorkOrderDetailViewProps {
  workOrder: WorkOrder;
  onEditWorkOrder: () => void;
}

export const WorkOrderDetailView: React.FC<WorkOrderDetailViewProps> = ({
  workOrder,
  onEditWorkOrder
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on hold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in progress':
        return <Play className="w-4 h-4" />;
      case 'pending':
        return <Circle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string | Date | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const workOrderDueDate = workOrder.dueDate || workOrder.due_date;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(workOrder.status)} flex items-center gap-1`}
              >
                {getStatusIcon(workOrder.status)}
                {workOrder.status || 'Pending'}
              </Badge>
              {workOrder.priority && (
                <Badge 
                  variant="outline" 
                  className={getPriorityColor(workOrder.priority)}
                >
                  {workOrder.priority} Priority
                </Badge>
              )}
              {isOverdue(workOrderDueDate) && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Overdue
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              {workOrder.title || 'Untitled Work Order'}
            </h1>
            <p className="text-muted-foreground">
              Work Order ID: #{workOrder.id?.slice(0, 8)}
            </p>
          </div>
          <Button onClick={onEditWorkOrder} className="ml-4">
            <Settings className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workOrder.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{workOrder.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Due Date</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(workOrderDueDate)}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Category</h4>
                  <p className="text-muted-foreground">
                    {workOrder.category || 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Assigned To</h4>
                  <p className="text-muted-foreground">
                    {workOrder.assignedTo?.length ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{workOrder.location?.name || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              
              {workOrder.asset && (
                <div>
                  <h4 className="font-medium mb-1">Asset</h4>
                  <p className="text-muted-foreground">{workOrder.asset.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Estimated Time</h4>
                  <p className="text-muted-foreground">
                    Not estimated
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Time Spent</h4>
                  <p className="text-muted-foreground">
                    {workOrder.timeSpent ? `${workOrder.timeSpent}h` : '0h'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Created</h4>
                  <p className="text-muted-foreground">
                    {formatDate(workOrder.createdAt || workOrder.created_at)}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Last Updated</h4>
                  <p className="text-muted-foreground">
                    {formatDate(workOrder.updatedAt || workOrder.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {workOrder.tags?.length && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {workOrder.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};