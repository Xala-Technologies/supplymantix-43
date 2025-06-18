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
import { WorkOrder } from "@/types/workOrder";
import { useWorkOrderStatusUpdate } from "@/hooks/useWorkOrdersIntegration";

interface WorkOrderStatusFlowProps {
  workOrder: WorkOrder;
}

export const WorkOrderStatusFlow = ({ workOrder }: WorkOrderStatusFlowProps) => {
  const [notes, setNotes] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const updateStatus = useWorkOrderStatusUpdate();

  const handleStatusChange = async (newStatus: string, statusNotes?: string) => {
    setIsChangingStatus(true);
    try {
      await updateStatus.mutateAsync({
        id: workOrder.id,
        status: newStatus,
        notes: statusNotes || notes
      });
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
          { action: 'open', label: 'Publish', icon: Play, color: 'blue' }
        ];
      case 'open':
        return [
          { action: 'in_progress', label: 'Start Work', icon: Play, color: 'blue' },
          { action: 'on_hold', label: 'Put On Hold', icon: Pause, color: 'orange' }
        ];
      case 'in_progress':
        return [
          { action: 'completed', label: 'Mark Complete', icon: CheckCircle, color: 'green' },
          { action: 'on_hold', label: 'Put On Hold', icon: Pause, color: 'orange' }
        ];
      case 'on_hold':
        return [
          { action: 'in_progress', label: 'Resume Work', icon: Play, color: 'blue' },
          { action: 'cancelled', label: 'Cancel', icon: AlertCircle, color: 'red' }
        ];
      case 'completed':
        return [
          { action: 'archived', label: 'Archive', icon: Archive, color: 'gray' }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Status Management
          </span>
          <Badge className={getStatusColor(workOrder.status)}>
            {workOrder.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Progress Timeline */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-3 h-3 rounded-full ${
              ['draft', 'open', 'in_progress', 'on_hold', 'completed', 'archived'].includes(workOrder.status)
                ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <span className="text-xs">Draft</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-3 h-3 rounded-full ${
              ['open', 'in_progress', 'on_hold', 'completed', 'archived'].includes(workOrder.status)
                ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <span className="text-xs">Open</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-3 h-3 rounded-full ${
              ['in_progress', 'completed', 'archived'].includes(workOrder.status)
                ? 'bg-yellow-500' : 'bg-gray-300'
            }`} />
            <span className="text-xs">In Progress</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2" />
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-3 h-3 rounded-full ${
              ['completed', 'archived'].includes(workOrder.status)
                ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className="text-xs">Complete</span>
          </div>
        </div>

        {/* Status Change Notes */}
        {availableActions.length > 0 && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="status-notes">Status Change Notes (Optional)</Label>
              <Textarea
                id="status-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this status change..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.action}
                    onClick={() => handleStatusChange(action.action, notes)}
                    disabled={isChangingStatus}
                    variant="outline"
                    className={`flex items-center gap-2 ${
                      action.color === 'green' ? 'border-green-500 text-green-700 hover:bg-green-50' :
                      action.color === 'blue' ? 'border-blue-500 text-blue-700 hover:bg-blue-50' :
                      action.color === 'orange' ? 'border-orange-500 text-orange-700 hover:bg-orange-50' :
                      action.color === 'red' ? 'border-red-500 text-red-700 hover:bg-red-50' :
                      'border-gray-500 text-gray-700 hover:bg-gray-50'
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

        {/* Current Status Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>
              Status: <strong>{workOrder.status.replace('_', ' ')}</strong>
              {workOrder.updated_at && (
                <span className="ml-2">
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
