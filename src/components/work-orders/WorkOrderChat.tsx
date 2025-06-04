
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Image, Mic, MoreVertical, Reply } from "lucide-react";
import { format } from "date-fns";
import { useChatMessages, useCreateChatMessage } from "@/hooks/useWorkOrders";

interface WorkOrderChatProps {
  workOrderId: string;
}

interface ChatMessage {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  users?: {
    email: string;
  };
  attachments?: string[];
  message_type?: 'text' | 'status_update' | 'assignment' | 'system';
}

export const WorkOrderChat = ({ workOrderId }: WorkOrderChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { data: messages = [], isLoading } = useChatMessages(workOrderId);
  const createMessage = useCreateChatMessage();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        work_order_id: workOrderId,
        message: newMessage,
        tenant_id: "sample-tenant-id", // This should come from auth context
        user_id: "current-user-id" // This should come from auth context
      };

      await createMessage.mutateAsync(messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].split('.').map(n => n[0]).join('').toUpperCase();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return format(date, 'MMM dd, h:mm a');
  };

  const sampleMessages: ChatMessage[] = [
    {
      id: '1',
      message: 'Started working on the wrapper malfunction. Initial inspection shows issues with the cutting assembly.',
      user_id: '1',
      created_at: '2023-10-05T09:15:00Z',
      users: { email: 'zach.brown@company.com' },
      message_type: 'text'
    },
    {
      id: '2',
      message: 'Work order status changed from "Open" to "In Progress"',
      user_id: 'system',
      created_at: '2023-10-05T09:16:00Z',
      users: { email: 'system@company.com' },
      message_type: 'status_update'
    },
    {
      id: '3',
      message: 'Found the issue - the cutting blade is worn and needs replacement. I\'ve identified the part number: CB-2847. Waiting for parts to arrive.',
      user_id: '1',
      created_at: '2023-10-05T10:30:00Z',
      users: { email: 'zach.brown@company.com' },
      message_type: 'text',
      attachments: ['cutting_blade_photo.jpg']
    },
    {
      id: '4',
      message: 'Parts have been ordered from Grainger. ETA is tomorrow morning.',
      user_id: '2',
      created_at: '2023-10-05T11:45:00Z',
      users: { email: 'sarah.johnson@company.com' },
      message_type: 'text'
    },
    {
      id: '5',
      message: 'Work order status changed from "In Progress" to "On Hold"',
      user_id: 'system',
      created_at: '2023-10-05T11:46:00Z',
      users: { email: 'system@company.com' },
      message_type: 'status_update'
    }
  ];

  const allMessages = [...sampleMessages, ...messages];

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'status_update':
        return 'bg-blue-50 border-blue-200';
      case 'assignment':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Work Order Discussion</span>
          <Badge variant="outline" className="text-xs">
            {allMessages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {allMessages.map((message) => (
            <div key={message.id} className={`border rounded-lg p-4 ${getMessageTypeColor(message.message_type)}`}>
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {message.users?.email ? getInitials(message.users.email) : 'SY'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {message.users?.email?.split('@')[0].replace('.', ' ') || 'System'}
                    </span>
                    {message.message_type && message.message_type !== 'text' && (
                      <Badge variant="secondary" className="text-xs">
                        {message.message_type.replace('_', ' ')}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    {message.message}
                  </p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                          <Paperclip className="w-3 h-3" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700">
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                  ZB
                </AvatarFallback>
              </Avatar>
              <span>Zach Brown is typing...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Image className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-12"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || createMessage.isPending}
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{newMessage.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
