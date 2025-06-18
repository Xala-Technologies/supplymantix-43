import React from 'react';
import { WorkOrderDetailCard } from '@/components/work-orders/WorkOrderDetailCard';
import { WorkOrderProcedureSection } from '@/components/work-orders/WorkOrderProcedureSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkOrder } from '@/types/workOrder';
import { Clock, Users, MapPin, AlertCircle } from 'lucide-react';
import { getAssetName, getLocationName } from '@/utils/assetUtils';

interface WorkOrderDetailEnhancedProps {
  workOrder: WorkOrder;
}

export const WorkOrderDetailEnhanced = ({ workOrder }: WorkOrderDetailEnhancedProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-gray-100 text-gray-800 border-gray-300',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'on_hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const isOverdue = workOrder.dueDate && new Date(workOrder.dueDate) < new Date() && workOrder.status !== 'completed';

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
                <span>•</span>
                <span>{getLocationName(workOrder.location)}</span>
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
          <p className="text-gray-700 mb-4">{workOrder.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">Due Date</div>
                <div className={isOverdue ? "text-red-600" : "text-gray-600"}>
                  {new Date(workOrder.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">Assigned To</div>
                <div className="text-gray-600">
                  {workOrder.assignedTo.length > 0 ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">Category</div>
                <div className="text-gray-600 capitalize">{workOrder.category}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time and Cost Summary */}
      {(workOrder.timeSpent || workOrder.totalCost || workOrder.partsUsed?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {workOrder.timeSpent && (
                <div>
                  <div className="font-medium text-gray-900">Time Spent</div>
                  <div className="text-gray-600">{workOrder.timeSpent} hours</div>
                </div>
              )}
              
              {workOrder.totalCost && (
                <div>
                  <div className="font-medium text-gray-900">Total Cost</div>
                  <div className="text-gray-600">${workOrder.totalCost.toFixed(2)}</div>
                </div>
              )}
              
              {workOrder.partsUsed?.length && (
                <div>
                  <div className="font-medium text-gray-900">Parts Used</div>
                  <div className="text-gray-600">{workOrder.partsUsed.length} items</div>
                </div>
              )}
            </div>
            
            {workOrder.partsUsed?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="font-medium text-gray-900 mb-2">Parts Details</div>
                <div className="space-y-2">
                  {workOrder.partsUsed.map((part, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{part.name} (x{part.quantity})</span>
                      {part.cost && (
                        <span className="text-gray-600">${part.cost.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Procedures Section */}
      <WorkOrderProcedureSection workOrderId={workOrder.id} />

      {/* Original Detail Card for Additional Features */}
      <WorkOrderDetailCard workOrder={workOrder} />
    </div>
  );
};
