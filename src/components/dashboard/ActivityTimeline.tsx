
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TimelineActivity {
  id: string;
  type: 'work_order' | 'procedure' | 'asset';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  user?: string;
}

interface ActivityTimelineProps {
  activities: TimelineActivity[];
}

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'work_order':
        return 'bg-blue-500';
      case 'procedure':
        return 'bg-green-500';
      case 'asset':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'default';
      case 'on_hold':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type)}`} />
                {index < activities.length - 1 && (
                  <div className="w-px h-8 bg-gray-200 mt-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  {activity.status && (
                    <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                      {activity.status.replace('_', ' ')}
                    </Badge>
                  )}
                  {activity.user && (
                    <span className="text-xs text-gray-500">by {activity.user}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
