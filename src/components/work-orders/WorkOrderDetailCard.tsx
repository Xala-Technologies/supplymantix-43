import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, AlertCircle, Calendar, Tag, Settings } from 'lucide-react';
import { WorkOrder } from '@/types/workOrder';
import { SubWorkOrdersTable } from './SubWorkOrdersTable';
import { WorkOrderAttachmentsDisplay } from './WorkOrderAttachmentsDisplay';

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

  // Helper functions to extract names from objects or return strings
  const getAssetName = (asset: any) => {
    if (!asset) return 'No asset assigned';
    if (typeof asset === 'string') return asset;
    if (typeof asset === 'object' && asset.name) return asset.name;
    return 'Unknown asset';
  };

  const getLocationName = (location: any) => {
    if (!location) return 'No location assigned';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.name) return location.name;
    return 'Unknown location';
  };

  const getAssignedUserName = (assignedUser: any, assigned_to: any) => {
    // Try to get from joined user data first
    if (assignedUser) {
      const name = assignedUser.first_name && assignedUser.last_name 
        ? `${assignedUser.first_name} ${assignedUser.last_name}`
        : assignedUser.email;
      return name;
    }
    // Fall back to assigned_to field
    if (assigned_to) return assigned_to;
    return 'Unassigned';
  };

  const formatEstimatedTime = (workOrder: any) => {
    const hours = workOrder.estimated_hours || (workOrder as any)?.estimated_hours;
    const minutes = workOrder.estimated_minutes || (workOrder as any)?.estimated_minutes;
    if (!hours && !minutes) return 'Not set';
    const h = hours || 0;
    const m = minutes || 0;
    return `${h}h ${m}m`;
  };

  const getWorkType = (workOrder: any) => {
    return workOrder.work_type || (workOrder as any)?.work_type || null;
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
                <span>#{workOrder.id.slice(-8)}</span>
                <span>•</span>
                <span>{getAssetName((workOrder as any)?.asset || (workOrder as any)?.assets)}</span>
                <span>•</span>
                <span>{getLocationName((workOrder as any)?.location || (workOrder as any)?.locations)}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Due Date */}
            {workOrder.due_date && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Due Date</div>
                <div className={`flex items-center gap-2 text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(workOrder.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            
            {/* Start Date */}
            {workOrder.start_date && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Start Date</div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(workOrder.start_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            
            {/* Estimated Time */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Estimated Time</div>
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <Clock className="w-4 h-4" />
                <span>{formatEstimatedTime(workOrder)}</span>
              </div>
            </div>
          </div>

          {/* Second row of info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Work Type */}
            {getWorkType(workOrder) && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Work Type</div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Settings className="w-4 h-4" />
                  <span className="capitalize">{getWorkType(workOrder)}</span>
                </div>
              </div>
            )}
            
            {/* Category */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Category</div>
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <Tag className="w-4 h-4" />
                <span className="capitalize">{workOrder.category}</span>
              </div>
            </div>
            
            {/* Work Order ID */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Work Order ID</div>
              <div className="text-sm text-gray-900">#{workOrder.id.slice(-8)}</div>
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
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Assigned To</div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                {getAssignedUserName((workOrder as any)?.assigned_user, workOrder.assigned_to)}
              </span>
            </div>
          </div>

          {/* Procedures Section */}
          {(workOrder as any)?.procedures && (workOrder as any).procedures.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Procedures</div>
              <div className="space-y-2">
                {(workOrder as any).procedures.map((procedure: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {procedure.procedure?.title || 'Unknown Procedure'}
                      </span>
                      {procedure.procedure?.description && (
                        <p className="text-xs text-gray-600">{procedure.procedure.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      procedure.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      procedure.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {procedure.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

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
