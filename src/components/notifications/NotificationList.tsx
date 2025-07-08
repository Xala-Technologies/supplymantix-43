import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  CheckCheck, 
  X,
  ExternalLink,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

interface NotificationListProps {
  maxHeight?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  maxHeight = "300px"
}) => {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    getNotificationColor
  } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if unread
    if (!notification.read_at) {
      await markAsRead([notification.id]);
    }

    // Navigate to work order if applicable
    if (notification.data?.work_order_id) {
      // Close dropdown and navigate
      navigate(`/dashboard/work-orders`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* Actions Header */}
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllAsRead}
          className="text-xs h-7 px-2"
          disabled={notifications.filter(n => !n.read_at).length === 0}
        >
          <CheckCheck className="h-3 w-3 mr-1" />
          Mark all read
        </Button>
      </div>

      {/* Notifications List */}
      <ScrollArea style={{ maxHeight }}>
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read_at ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-8 h-8 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center text-sm`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium truncate ${
                      !notification.read_at ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.read_at && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    
                    {notification.data?.work_order_id && (
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="border-t p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => navigate('/dashboard/notifications')}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};