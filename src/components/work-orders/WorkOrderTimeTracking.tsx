
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, User } from "lucide-react";
import { useTimeLogs, useCreateTimeLog } from "@/hooks/useWorkOrdersEnhanced";
import { format } from "date-fns";

interface WorkOrderTimeTrackingProps {
  workOrderId: string;
}

export const WorkOrderTimeTracking = ({ workOrderId }: WorkOrderTimeTrackingProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");

  const { data: timeLogs, isLoading } = useTimeLogs(workOrderId);
  const createTimeLog = useCreateTimeLog();

  const handleAddTime = async () => {
    if (!duration || isNaN(Number(duration))) return;

    await createTimeLog.mutateAsync({
      work_order_id: workOrderId,
      user_id: '', // Will be filled by the API from auth context
      duration_minutes: Number(duration),
      note: note.trim() || undefined,
    });

    setDuration("");
    setNote("");
    setShowAddForm(false);
  };

  const totalMinutes = timeLogs?.reduce((total, log) => total + log.duration_minutes, 0) || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracking
          </CardTitle>
          <div className="flex items-center gap-4">
            {totalMinutes > 0 && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                Total: {totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${remainingMinutes}m`}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {timeLogs?.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No time logged yet</p>
            <p className="text-xs text-gray-400 mt-1">Track time spent on this work order</p>
          </div>
        )}

        <div className="space-y-3">
          {timeLogs?.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {log.user?.first_name && log.user?.last_name 
                      ? `${log.user.first_name} ${log.user.last_name}`
                      : log.user?.email
                    }
                  </span>
                  <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                    {formatDuration(log.duration_minutes)}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  {format(new Date(log.logged_at), 'MMM dd, yyyy at h:mm a')}
                </div>
                
                {log.note && (
                  <p className="text-sm text-gray-600">{log.note}</p>
                )}
              </div>
            </div>
          ))}

          {showAddForm && (
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-white w-32"
                    min="1"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
                
                <Textarea
                  placeholder="Notes (optional)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-white min-h-[60px]"
                />
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddTime}
                    disabled={!duration || isNaN(Number(duration)) || createTimeLog.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createTimeLog.isPending ? "Logging..." : "Log Time"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setDuration("");
                      setNote("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
