import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Check, 
  X, 
  RotateCcw, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';
import { useUpdateWorkOrder } from '@/hooks/useWorkOrders';
import { toast } from 'sonner';

interface WorkOrderStatusFlowProps {
  workOrder: {
    id: string;
    status: string;
    title: string;
  };
  onStatusUpdate?: (newStatus: string) => void;
}

const statusConfig = {
  open: {
    label: 'Open',
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    icon: AlertTriangle,
    nextStates: ['in_progress', 'cancelled'],
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
    icon: Play,
    nextStates: ['completed', 'on_hold', 'cancelled'],
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    icon: Pause,
    nextStates: ['in_progress', 'cancelled'],
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-500/10 text-green-700 border-green-200',
    icon: Check,
    nextStates: ['open'], // Allow reopening if needed
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-700 border-red-200',
    icon: X,
    nextStates: ['open'], // Allow reopening
  },
};

const statusActions = {
  in_progress: { label: 'Start Work', icon: Play, variant: 'default' as const },
  completed: { label: 'Complete', icon: Check, variant: 'default' as const },
  on_hold: { label: 'Put on Hold', icon: Pause, variant: 'secondary' as const },
  cancelled: { label: 'Cancel', icon: X, variant: 'destructive' as const },
  open: { label: 'Reopen', icon: RotateCcw, variant: 'outline' as const },
};

export const WorkOrderStatusFlow: React.FC<WorkOrderStatusFlowProps> = ({
  workOrder,
  onStatusUpdate
}) => {
  const updateWorkOrderMutation = useUpdateWorkOrder();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [reason, setReason] = useState('');

  const currentConfig = statusConfig[workOrder.status as keyof typeof statusConfig];
  const CurrentIcon = currentConfig?.icon || AlertTriangle;

  const handleStatusChange = async (newStatus: string, withReason = false) => {
    if (withReason) {
      setSelectedStatus(newStatus);
      setIsDialogOpen(true);
      return;
    }

    try {
      await updateWorkOrderMutation.mutateAsync({
        id: workOrder.id,
        updates: { status: newStatus as any }
      });
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }
      
      toast.success(`Work order ${statusActions[newStatus as keyof typeof statusActions]?.label.toLowerCase()}d successfully`);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDialogSubmit = async () => {
    if (!selectedStatus) return;

    try {
      await updateWorkOrderMutation.mutateAsync({
        id: workOrder.id,
        updates: { status: selectedStatus as any }
      });
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(selectedStatus);
      }
      
      toast.success(`Work order ${statusActions[selectedStatus as keyof typeof statusActions]?.label.toLowerCase()}d successfully`);
      setIsDialogOpen(false);
      setSelectedStatus('');
      setReason('');
    } catch (error) {
      // Error handled in mutation
    }
  };

  const availableTransitions = currentConfig?.nextStates || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrentIcon className="h-5 w-5" />
            Status Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
            </div>
            <Badge variant="outline" className={`${currentConfig?.color} text-sm py-1 px-3`}>
              <CurrentIcon className="h-3 w-3 mr-1" />
              {currentConfig?.label || workOrder.status}
            </Badge>
          </div>

          {/* Available Actions */}
          {availableTransitions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Available Actions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTransitions.map((status) => {
                  const action = statusActions[status as keyof typeof statusActions];
                  const Icon = action?.icon || ArrowRight;
                  
                  return (
                    <Button
                      key={status}
                      variant={action?.variant || 'outline'}
                      size="sm"
                      className="gap-2"
                      onClick={() => handleStatusChange(status, status === 'cancelled' || status === 'on_hold')}
                      disabled={updateWorkOrderMutation.isPending}
                    >
                      <Icon className="h-4 w-4" />
                      {action?.label || status}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {availableTransitions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No status changes available for the current state.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reason Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus === 'cancelled' ? 'Cancel Work Order' : 'Put Work Order on Hold'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">
                Reason {selectedStatus === 'cancelled' ? 'for cancellation' : 'for holding'} (optional)
              </Label>
              <Textarea
                id="reason"
                placeholder={`Explain why this work order is being ${selectedStatus === 'cancelled' ? 'cancelled' : 'put on hold'}...`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedStatus('');
                  setReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant={selectedStatus === 'cancelled' ? 'destructive' : 'secondary'}
                onClick={handleDialogSubmit}
                disabled={updateWorkOrderMutation.isPending}
              >
                {updateWorkOrderMutation.isPending ? 'Updating...' : 
                  selectedStatus === 'cancelled' ? 'Cancel Work Order' : 'Put on Hold'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};