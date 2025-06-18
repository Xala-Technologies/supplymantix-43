import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, AlertCircle, Calendar, Tag } from 'lucide-react';
import { WorkOrder } from '@/types/workOrder';
import { EnhancedChecklist } from './EnhancedChecklist';
import { WorkOrderTimeTracking } from './WorkOrderTimeTracking';
import { WorkOrderProcedureSection } from './WorkOrderProcedureSection';
import { TimeAndCostTracking } from './TimeAndCostTracking';
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
              <CardTitle className="text-xl mb-2">{workOrder.title}</CardTitle>
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
              <Badge className={`border ${getStatusColor(workOrder.status)}`}>
                {workOrder.status.replace('_', ' ')}
              </Badge>
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
          {workOrder.description && (
            <p className="text-gray-700 mb-4">{workOrder.description}</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workOrder.due_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Due Date</div>
                  <div className={isOverdue ? "text-red-600" : "text-gray-600"}>
                    {new Date(workOrder.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">Assigned To</div>
                <div className="text-gray-600">
                  {workOrder.assignedTo?.length > 0 ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                </div>
              </div>
            </div>
            
            {workOrder.category && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Category</div>
                  <div className="text-gray-600 capitalize">{workOrder.category}</div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {workOrder.tags && workOrder.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">Tags</span>
              </div>
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

      {/* Enhanced Checklist */}
      <EnhancedChecklist workOrderId={workOrder.id} />

      {/* Time Tracking */}
      <WorkOrderTimeTracking workOrderId={workOrder.id} />

      {/* Procedures Section */}
      <WorkOrderProcedureSection workOrderId={workOrder.id} />

      {/* Time and Cost Tracking */}
      <TimeAndCostTracking workOrderId={workOrder.id} />
    </div>
  );
};
