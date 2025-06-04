
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
  // Optional properties for sample data
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
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm';
      case 'assignment':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm';
      case 'system':
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm';
      default:
        return 'bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-gray-500 py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading messages...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] md:h-[600px] flex flex-col shadow-lg border-0 bg-gradient-to-b from-white to-gray-50">
      <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 bg-white border-b border-gray-100">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-900">Work Order Discussion</span>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            {allMessages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-gray-50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 md:space-y-5">
          {allMessages.map((message) => (
            <div key={message.id} className={`border rounded-xl p-4 md:p-5 ${getMessageTypeColor((message as any).message_type)} transition-all duration-200 hover:scale-[1.01]`}>
              <div className="flex items-start gap-3 md:gap-4">
                <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                    {message.users?.email ? getInitials(message.users.email) : 'SY'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-sm md:text-base text-gray-900">
                      {message.users?.email?.split('@')[0].replace('.', ' ') || 'System'}
                    </span>
                    {(message as any).message_type && (message as any).message_type !== 'text' && (
                      <Badge variant="secondary" className="text-xs bg-white/80 backdrop-blur-sm">
                        {(message as any).message_type.replace('_', ' ')}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-3 break-words">
                    {message.message}
                  </p>
                  
                  {(message as any).attachments && (message as any).attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(message as any).attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 text-sm hover:bg-white/90 transition-colors cursor-pointer">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="truncate max-w-32 md:max-w-none font-medium text-gray-700">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 text-sm text-gray-600">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-xs">
                  ZB
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Zach Brown is typing</span>
              <div className="flex gap-1 ml-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-9 w-9 p-0 hover:bg-gray-100 transition-colors">
              <Paperclip className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-9 w-9 p-0 hover:bg-gray-100 transition-colors">
              <Image className="w-4 h-4 text-gray-500" />
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
                className="pr-12 text-sm md:text-base h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || createMessage.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-9 w-9 p-0 hover:bg-gray-100 transition-colors">
              <Mic className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span className="hidden sm:block">Press Enter to send, Shift+Enter for new line</span>
            <span className="sm:hidden">Enter to send</span>
            <span className="font-medium">{newMessage.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
