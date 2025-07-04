import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  UserPlus, 
  MessageSquare, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Clock,
  FileText
} from 'lucide-react';

interface ActivityItem {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  action: 'created' | 'assigned' | 'reassigned' | 'comment' | 'status_change' | 'edited' | 'deleted';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  comment?: string;
  details?: any;
}

const mockActivityData: ActivityItem[] = [
  {
    id: '1',
    workOrderId: 'WO-001',
    workOrderTitle: 'HVAC System Maintenance',
    action: 'created',
    user: { id: '1', name: 'John Smith', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    workOrderId: 'WO-001',
    workOrderTitle: 'HVAC System Maintenance',
    action: 'assigned',
    user: { id: '2', name: 'Sarah Johnson', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    details: { assignedTo: 'Mike Wilson' },
  },
  {
    id: '3',
    workOrderId: 'WO-002',
    workOrderTitle: 'Generator Inspection',
    action: 'comment',
    user: { id: '3', name: 'Mike Wilson', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    comment: 'Started the inspection process. Found minor oil leak that needs attention.',
  },
  {
    id: '4',
    workOrderId: 'WO-001',
    workOrderTitle: 'HVAC System Maintenance',
    action: 'status_change',
    user: { id: '3', name: 'Mike Wilson', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    details: { from: 'open', to: 'in_progress' },
  },
  {
    id: '5',
    workOrderId: 'WO-003',
    workOrderTitle: 'Pump Replacement',
    action: 'created',
    user: { id: '4', name: 'Lisa Chen', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: '6',
    workOrderId: 'WO-002',
    workOrderTitle: 'Generator Inspection',
    action: 'comment',
    user: { id: '2', name: 'Sarah Johnson', avatar: undefined },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    comment: 'Scheduled for next Tuesday morning.',
  },
];

export const RecentActivityTab = () => {
  const [showComments, setShowComments] = useState(true);
  const [showAllUpdates, setShowAllUpdates] = useState(true);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'assigned': 
      case 'reassigned': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'status_change': return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'edited': return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'deleted': return <Trash2 className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionText = (activity: ActivityItem) => {
    switch (activity.action) {
      case 'created': return 'created this work order';
      case 'assigned': return `assigned this work order to ${activity.details?.assignedTo}`;
      case 'reassigned': return `reassigned this work order to ${activity.details?.assignedTo}`;
      case 'comment': return 'added a comment';
      case 'status_change': return `changed status from ${activity.details?.from} to ${activity.details?.to}`;
      case 'edited': return 'edited this work order';
      case 'deleted': return 'deleted this work order';
      default: return 'performed an action';
    }
  };

  const filteredActivities = mockActivityData.filter(activity => {
    if (!showComments && activity.action === 'comment') return false;
    if (!showAllUpdates && ['status_change', 'edited'].includes(activity.action)) return false;
    return true;
  });

  // Group activities by work order
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (!groups[activity.workOrderId]) {
      groups[activity.workOrderId] = {
        workOrder: {
          id: activity.workOrderId,
          title: activity.workOrderTitle,
        },
        activities: [],
      };
    }
    groups[activity.workOrderId].activities.push(activity);
    return groups;
  }, {} as Record<string, { workOrder: { id: string; title: string }; activities: ActivityItem[] }>);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-comments" 
                checked={showComments} 
                onCheckedChange={setShowComments} 
              />
              <Label htmlFor="show-comments">Show Comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-updates" 
                checked={showAllUpdates} 
                onCheckedChange={setShowAllUpdates} 
              />
              <Label htmlFor="show-updates">Show All Updates</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="space-y-6">
        {Object.values(groupedActivities).map(({ workOrder, activities }) => (
          <Card key={workOrder.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{workOrder.id}</p>
                </div>
                <Badge variant="outline">{activities.length} activities</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          {getActionIcon(activity.action)}
                          <span className="font-medium">{activity.user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {getActionText(activity)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        
                        {activity.comment && (
                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            {activity.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(groupedActivities).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-500 text-center">
                No activity matches your current filters. Try adjusting the filter settings above.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};