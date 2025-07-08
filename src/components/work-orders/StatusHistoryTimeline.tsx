import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useWorkOrderStatusHistory } from '@/hooks/useWorkOrderStatusHistory';
import { Skeleton } from '@/components/ui/skeleton';

interface StatusHistoryTimelineProps {
  workOrderId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-500/10 text-blue-700 border-blue-200';
    case 'in_progress':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    case 'completed':
      return 'bg-green-500/10 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-red-500/10 text-red-700 border-red-200';
    case 'on_hold':
      return 'bg-orange-500/10 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-500/10 text-gray-700 border-gray-200';
  }
};

const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const StatusHistoryTimeline: React.FC<StatusHistoryTimelineProps> = ({
  workOrderId
}) => {
  const { data: history = [], isLoading } = useWorkOrderStatusHistory(workOrderId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No status changes recorded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-primary' : 'bg-gray-300'
                }`} />
                {index < history.length - 1 && (
                  <div className="absolute top-3 left-1/2 w-px h-8 bg-gray-200 transform -translate-x-1/2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.old_status && (
                    <>
                      <Badge variant="outline" className={getStatusColor(item.old_status)}>
                        {formatStatus(item.old_status)}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </>
                  )}
                  <Badge variant="outline" className={getStatusColor(item.new_status)}>
                    {formatStatus(item.new_status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>
                      {item.user ? 
                        `${item.user.first_name || ''} ${item.user.last_name || ''}`.trim() || item.user.email
                        : 'System'
                      }
                    </span>
                  </div>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(item.changed_at), { addSuffix: true })}</span>
                </div>

                {item.reason && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    "{item.reason}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};