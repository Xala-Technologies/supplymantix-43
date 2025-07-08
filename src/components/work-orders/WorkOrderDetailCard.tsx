import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, AlertCircle, Calendar, Tag } from 'lucide-react';
import { WorkOrder } from '@/types/workOrder';
import { SubWorkOrdersTable } from './SubWorkOrdersTable';
import { WorkOrderAttachmentsDisplay } from './WorkOrderAttachmentsDisplay';
import { getAssetName, getLocationName } from '@/utils/assetUtils';

interface WorkOrderDetailCardProps {
  workOrder: WorkOrder;
}

export const WorkOrderDetailCard = ({ workOrder }: WorkOrderDetailCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800 border-gray-300',
      'open': 'bg-blue-100 text-blue-800 border-blue-300',
      'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'on_hold': 'bg-orange-100 text-orange-800 border-orange-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'archived': 'bg-slate-100 text-slate-800 border-slate-300',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'urgent': 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const isOverdue = workOrder.due_date && new Date(workOrder.due_date) < new Date() && workOrder.status !== 'completed';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <CardTitle className="text-xl">{workOrder.title}</CardTitle>
                <Badge className={`border ${getStatusColor(workOrder.status)}`}>
                  {workOrder.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>#{workOrder.id.slice(-4)}</span>
                <span>•</span>
                <span>{getAssetName(workOrder.asset)}</span>
                {workOrder.location && (
                  <>
                    <span>•</span>
                    <span>{getLocationName(workOrder.location)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={`border ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority} priority
              </Badge>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {workOrder.due_date && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Due Date</div>
                <div className={`flex items-center gap-2 text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(workOrder.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Estimated Time</div>
              <div className="text-sm text-gray-900">
                {(workOrder as any).estimated_minutes ? `${Math.floor((workOrder as any).estimated_minutes / 60)}h ${(workOrder as any).estimated_minutes % 60}m` : 'Not set'}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Priority</div>
              <Badge className={`border ${getPriorityColor(workOrder.priority)}`}>
                {workOrder.priority}
              </Badge>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Work Order ID</div>
              <div className="text-sm text-gray-900">#{workOrder.id.slice(-4)}</div>
            </div>
          </div>

          {/* Description */}
          {workOrder.description && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Description</div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{workOrder.description}</p>
            </div>
          )}

          {/* Assigned To Section */}
          {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Assigned To</div>
              <div className="flex flex-wrap gap-2">
                {workOrder.assignedTo.map((assignee, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Type - Remove this section since work_type is optional */}

          {/* Tags */}
          {workOrder.tags && workOrder.tags.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {workOrder.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sub Work Orders */}
      <SubWorkOrdersTable parentWorkOrderId={workOrder.id} />

      {/* Attachments */}
      <WorkOrderAttachmentsDisplay workOrderId={workOrder.id} />
    </div>
  );
};
