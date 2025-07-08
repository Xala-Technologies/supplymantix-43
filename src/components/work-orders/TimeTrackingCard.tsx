import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Clock, Plus, User } from 'lucide-react';
import { useTimeTracking, useLogTime } from '@/hooks/useTimeTracking';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface TimeTrackingCardProps {
  workOrderId: string;
}

export const TimeTrackingCard: React.FC<TimeTrackingCardProps> = ({
  workOrderId
}) => {
  const { data: timeLogs = [], isLoading } = useTimeTracking(workOrderId);
  const logTimeMutation = useLogTime();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  const totalMinutes = timeLogs.reduce((sum, log) => sum + log.duration_minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const handleLogTime = async () => {
    const durationMinutes = parseInt(duration);
    if (!durationMinutes || durationMinutes <= 0) return;

    try {
      await logTimeMutation.mutateAsync({
        workOrderId,
        durationMinutes,
        note: note.trim() || undefined,
      });
      
      setIsDialogOpen(false);
      setDuration('');
      setNote('');
    } catch (error) {
      // Error handled in mutation
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Tracking
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Log Time
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Time Spent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Describe what you worked on..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogTime}
                    disabled={logTimeMutation.isPending || !duration}
                  >
                    {logTimeMutation.isPending ? 'Logging...' : 'Log Time'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total time summary */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {totalHours > 0 ? `${totalHours}h` : ''}{remainingMinutes > 0 ? ` ${remainingMinutes}m` : totalHours === 0 ? '0m' : ''}
            </div>
            <div className="text-sm text-muted-foreground">Total time logged</div>
          </div>
        </div>

        {/* Time entries */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : timeLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No time logged yet
          </p>
        ) : (
          <div className="space-y-3">
            {timeLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatDuration(log.duration_minutes)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>
                        {log.user ? 
                          `${log.user.first_name || ''} ${log.user.last_name || ''}`.trim() || log.user.email
                          : 'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {formatDistanceToNow(new Date(log.logged_at), { addSuffix: true })}
                  </div>
                  {log.note && (
                    <p className="text-sm text-muted-foreground italic">
                      "{log.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};