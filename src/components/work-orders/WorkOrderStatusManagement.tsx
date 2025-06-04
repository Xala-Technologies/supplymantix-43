
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, Pause, Play, AlertTriangle, User, Calendar } from "lucide-react";
import { format } from "date-fns";

interface WorkOrderStatusManagementProps {
  workOrder: any;
  onStatusChange?: (newStatus: string, comment?: string) => void;
}

export const WorkOrderStatusManagement = ({ workOrder, onStatusChange }: WorkOrderStatusManagementProps) => {
  const [newStatus, setNewStatus] = useState(workOrder.status);
  const [statusComment, setStatusComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800', icon: Clock },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Play },
    { value: 'on_hold', label: 'On Hold', color: 'bg-orange-100 text-orange-800', icon: Pause },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  ];

  const currentStatusConfig = statusOptions.find(s => s.value === workOrder.status);
  const newStatusConfig = statusOptions.find(s => s.value === newStatus);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await onStatusChange?.(newStatus, statusComment);
      setStatusComment("");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusHistory = () => [
    {
      status: 'open',
      timestamp: '2023-10-05T08:43:00Z',
      user: 'Dillan Menting',
      comment: 'Work order created'
    },
    {
      status: 'in_progress',
      timestamp: '2023-10-05T09:15:00Z',
      user: 'Zach Brown',
      comment: 'Started diagnosis of wrapper malfunction'
    },
    {
      status: 'on_hold',
      timestamp: '2023-10-05T11:30:00Z',
      user: 'Zach Brown',
      comment: 'Waiting for replacement parts to arrive'
    },
    {
      status: 'in_progress',
      timestamp: '2023-10-05T14:00:00Z',
      user: 'Zach Brown',
      comment: 'Parts received, resuming repair work'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentStatusConfig?.color.includes('green') ? 'bg-green-500' : 
              currentStatusConfig?.color.includes('yellow') ? 'bg-yellow-500' :
              currentStatusConfig?.color.includes('blue') ? 'bg-blue-500' :
              currentStatusConfig?.color.includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`} />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStatusConfig?.icon && <currentStatusConfig.icon className="w-5 h-5" />}
              <Badge className={currentStatusConfig?.color}>
                {currentStatusConfig?.label}
              </Badge>
              <span className="text-sm text-gray-600">
                Updated {format(new Date(workOrder.dueDate), 'MMM dd, yyyy h:mm a')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              New Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <status.icon className="w-4 h-4" />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Comment (Optional)
            </label>
            <Textarea
              placeholder="Add a comment about this status change..."
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handleStatusUpdate}
              disabled={isUpdating || newStatus === workOrder.status}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
            
            {newStatus !== workOrder.status && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>→</span>
                <Badge className={newStatusConfig?.color}>
                  {newStatusConfig?.label}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getStatusHistory().map((entry, index) => {
              const statusConfig = statusOptions.find(s => s.value === entry.status);
              return (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig?.color}`}>
                    {statusConfig?.icon && <statusConfig.icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{statusConfig?.label}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(entry.timestamp), 'MMM dd, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
                    </div>
                    {entry.comment && (
                      <p className="text-sm text-gray-700">{entry.comment}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
