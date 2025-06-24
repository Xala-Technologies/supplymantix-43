
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  Archive, 
  AlertCircle,
  FileText 
} from "lucide-react";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { useWorkOrderStatusUpdate } from "@/hooks/useWorkOrdersIntegration";

interface WorkOrderStatusFlowProps {
  workOrder: WorkOrder;
  onStatusUpdate?: (newStatus: WorkOrderStatus) => Promise<void>;
}

export const WorkOrderStatusFlow = ({ workOrder, onStatusUpdate }: WorkOrderStatusFlowProps) => {
  const [notes, setNotes] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const updateStatus = useWorkOrderStatusUpdate();

  const handleStatusChange = async (newStatus: WorkOrderStatus, statusNotes?: string) => {
    setIsChangingStatus(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(newStatus);
      } else {
        await updateStatus.mutateAsync({
          id: workOrder.id,
          status: newStatus,
          notes: statusNotes || notes
        });
      }
      setNotes("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'open': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'on_hold': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'archived': 'bg-slate-100 text-slate-800',
    };
    return colors[status] || colors.open;
  };

  const getAvailableActions = () => {
    const { status } = workOrder;
    
    switch (status) {
      case 'draft':
        return [
          { action: 'open' as WorkOrderStatus, label: 'Publish', icon: Play, color: 'blue' }
        ];
      case 'open':
        return [
          { action: 'in_progress' as WorkOrderStatus, label: 'Start Work', icon: Play, color: 'blue' },
          { action: 'on_hold' as WorkOrderStatus, label: 'Put On Hold', icon: Pause, color: 'orange' }
        ];
      case 'in_progress':
        return [
          { action: 'completed' as WorkOrderStatus, label: 'Mark Complete', icon: CheckCircle, color: 'green' },
          { action: 'on_hold' as WorkOrderStatus, label: 'Put On Hold', icon: Pause, color: 'orange' }
        ];
      case 'on_hold':
        return [
          { action: 'in_progress' as WorkOrderStatus, label: 'Resume Work', icon: Play, color: 'blue' },
          { action: 'cancelled' as WorkOrderStatus, label: 'Cancel', icon: AlertCircle, color: 'red' }
        ];
      case 'completed':
        return [
          { action: 'archived' as WorkOrderStatus, label: 'Archive', icon: Archive, color: 'gray' }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <Card className="border-gray-200 shadow-sm rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            Status Management
          </span>
          <Badge className={`${getStatusColor(workOrder.status)} font-medium border`}>
            {workOrder.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Enhanced Status Progress Timeline */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-4 h-4 rounded-full transition-colors ${
                ['draft', 'open', 'in_progress', 'on_hold', 'completed', 'archived'].includes(workOrder.status)
                  ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'
              }`} />
              <span className="text-xs font-medium">Draft</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-3" />
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-4 h-4 rounded-full transition-colors ${
                ['open', 'in_progress', 'on_hold', 'completed', 'archived'].includes(workOrder.status)
                  ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'
              }`} />
              <span className="text-xs font-medium">Open</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-3" />
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-4 h-4 rounded-full transition-colors ${
                ['in_progress', 'completed', 'archived'].includes(workOrder.status)
                  ? 'bg-yellow-500 ring-4 ring-yellow-100' : 'bg-gray-300'
              }`} />
              <span className="text-xs font-medium">In Progress</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-3" />
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-4 h-4 rounded-full transition-colors ${
                ['completed', 'archived'].includes(workOrder.status)
                  ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-300'
              }`} />
              <span className="text-xs font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Status Change Notes */}
        {availableActions.length > 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-notes" className="text-sm font-medium">Status Change Notes (Optional)</Label>
              <Textarea
                id="status-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this status change..."
                className="mt-2 min-h-[80px] border-gray-200 rounded-xl"
              />
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {availableActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.action}
                    onClick={() => handleStatusChange(action.action, notes)}
                    disabled={isChangingStatus}
                    variant="outline"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                      action.color === 'green' ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' :
                      action.color === 'blue' ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100' :
                      action.color === 'orange' ? 'border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100' :
                      action.color === 'red' ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' :
                      'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Current Status Info */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <span>
              Status: <strong className="text-gray-900">{workOrder.status.replace('_', ' ')}</strong>
              {workOrder.updated_at && (
                <span className="ml-2 text-gray-500">
                  • Last updated {new Date(workOrder.updated_at).toLocaleDateString()}
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
