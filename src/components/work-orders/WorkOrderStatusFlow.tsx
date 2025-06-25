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
  AlertCircle,
  FileText,
  RotateCcw
} from "lucide-react";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { useWorkOrderStatusUpdate } from "@/features/workOrders/hooks/useWorkOrdersIntegration";
import { toast } from "sonner";

interface WorkOrderStatusFlowProps {
  workOrder: WorkOrder;
  onStatusUpdate?: (newStatus: WorkOrderStatus) => Promise<void>;
}

export const WorkOrderStatusFlow = ({ workOrder, onStatusUpdate }: WorkOrderStatusFlowProps) => {
  const [notes, setNotes] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const updateStatusMutation = useWorkOrderStatusUpdate();

  const handleStatusChange = async (newStatus: WorkOrderStatus, statusNotes?: string) => {
    setIsChangingStatus(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(newStatus);
      } else {
        await updateStatusMutation.mutateAsync({
          id: workOrder.id,
          status: newStatus,
          notes: statusNotes || notes
        });
      }
      setNotes("");
      toast.success(`Work order status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update work order status");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'open': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'on_hold': 'bg-orange-100 text-orange-800 border-orange-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getAvailableActions = () => {
    const currentStatus = workOrder.status;
    
    switch (currentStatus) {
      case 'draft':
        return [
          { action: 'open' as WorkOrderStatus, label: 'Open Work Order', icon: Play, color: 'blue' }
        ];
      case 'open':
        return [
          { action: 'in_progress' as WorkOrderStatus, label: 'Start Work', icon: Play, color: 'blue' },
          { action: 'on_hold' as WorkOrderStatus, label: 'Put On Hold', icon: Pause, color: 'orange' },
          { action: 'cancelled' as WorkOrderStatus, label: 'Cancel', icon: AlertCircle, color: 'red' }
        ];
      case 'in_progress':
        return [
          { action: 'completed' as WorkOrderStatus, label: 'Mark Complete', icon: CheckCircle, color: 'green' },
          { action: 'on_hold' as WorkOrderStatus, label: 'Put On Hold', icon: Pause, color: 'orange' },
          { action: 'cancelled' as WorkOrderStatus, label: 'Cancel', icon: AlertCircle, color: 'red' }
        ];
      case 'on_hold':
        return [
          { action: 'in_progress' as WorkOrderStatus, label: 'Resume Work', icon: Play, color: 'blue' },
          { action: 'cancelled' as WorkOrderStatus, label: 'Cancel', icon: AlertCircle, color: 'red' }
        ];
      case 'completed':
        return [
          { action: 'open' as WorkOrderStatus, label: 'Reopen', icon: RotateCcw, color: 'blue' }
        ];
      case 'cancelled':
        return [
          { action: 'open' as WorkOrderStatus, label: 'Reopen', icon: RotateCcw, color: 'blue' }
        ];
      default:
        return [];
    }
  };

  const getStatusProgress = () => {
    const mainFlow = ['draft', 'open', 'in_progress', 'completed'];
    const currentStatus = workOrder.status;
    
    // Handle special statuses
    if (currentStatus === 'cancelled' || currentStatus === 'on_hold') {
      return mainFlow.map((status, index) => ({
        status,
        isActive: false,
        isCurrent: false
      }));
    }
    
    const currentIndex = mainFlow.indexOf(currentStatus);
    return mainFlow.map((status, index) => ({
      status,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  const availableActions = getAvailableActions();
  const statusProgress = getStatusProgress();
  const currentStatus = workOrder.status;

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
          <Badge className={`${getStatusColor(currentStatus)} font-medium border`}>
            {currentStatus.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Status Progress Timeline - Only show for main flow statuses */}
        {!['cancelled', 'on_hold'].includes(currentStatus) && (
          <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
            <div className="relative">
              <div className="flex items-center justify-between">
                {statusProgress.map((item, index) => (
                  <div key={item.status} className="flex flex-col items-center space-y-3 flex-1 relative z-10">
                    <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                      item.isActive
                        ? item.isCurrent 
                          ? 'bg-blue-500 ring-4 ring-blue-100 shadow-lg' 
                          : 'bg-green-500 shadow-md'
                        : 'bg-gray-300'
                    }`} />
                    <span className={`text-sm font-medium text-center px-2 py-1 rounded-md transition-colors ${
                      item.isActive 
                        ? item.isCurrent
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-green-700 bg-green-50'
                        : 'text-gray-500'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progress line */}
              <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-green-400 transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${Math.max(0, (statusProgress.findIndex(s => s.isCurrent) / (statusProgress.length - 1)) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Special Status Message */}
        {['cancelled', 'on_hold'].includes(currentStatus) && (
          <div className={`p-4 rounded-xl border-2 border-dashed ${
            currentStatus === 'cancelled' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}>
            <div className="flex items-center gap-3">
              {currentStatus === 'cancelled' ? (
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              ) : (
                <Pause className="w-6 h-6 flex-shrink-0" />
              )}
              <div>
                <span className="font-semibold block">
                  Work order is {currentStatus === 'cancelled' ? 'cancelled' : 'on hold'}
                </span>
                <span className="text-sm opacity-80">
                  {currentStatus === 'cancelled' 
                    ? 'This work order has been cancelled and is no longer active.' 
                    : 'This work order is temporarily paused and can be resumed.'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Actions */}
        {availableActions.length > 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-notes" className="text-sm font-medium text-gray-700">
                Status Change Notes (Optional)
              </Label>
              <Textarea
                id="status-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this status change..."
                className="mt-2 min-h-[80px] border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {availableActions.map((action) => {
                const IconComponent = action.icon;
                const colorClasses = {
                  green: 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-400',
                  blue: 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400',
                  orange: 'border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-400',
                  red: 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400',
                  gray: 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                };

                return (
                  <Button
                    key={action.action}
                    onClick={() => handleStatusChange(action.action, notes)}
                    disabled={isChangingStatus || updateStatusMutation.isPending}
                    variant="outline"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      colorClasses[action.color as keyof typeof colorClasses]
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {isChangingStatus || updateStatusMutation.isPending ? "Updating..." : action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Status Info */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">
                Status: <span className="text-gray-900">{currentStatus.replace('_', ' ')}</span>
              </div>
              {workOrder.updated_at && (
                <div className="text-gray-500 text-xs mt-1">
                  Last updated: {new Date(workOrder.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
