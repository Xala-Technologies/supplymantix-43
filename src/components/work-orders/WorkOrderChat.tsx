
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Image, Mic, MoreVertical, Reply, Clock, CheckCheck } from "lucide-react";
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

  const getMessageTypeStyle = (type?: string) => {
    switch (type) {
      case 'status_update':
        return {
          bg: 'bg-gradient-to-r from-blue-50 via-blue-25 to-indigo-50',
          border: 'border-blue-200/60',
          shadow: 'shadow-blue-100/50',
          icon: '🔄'
        };
      case 'assignment':
        return {
          bg: 'bg-gradient-to-r from-green-50 via-emerald-25 to-green-50',
          border: 'border-green-200/60',
          shadow: 'shadow-green-100/50',
          icon: '👤'
        };
      case 'system':
        return {
          bg: 'bg-gradient-to-r from-gray-50 via-slate-25 to-gray-50',
          border: 'border-gray-200/60',
          shadow: 'shadow-gray-100/50',
          icon: '⚙️'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200/80',
          shadow: 'shadow-sm hover:shadow-lg',
          icon: '💬'
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/30">
        <CardContent className="p-8">
          <div className="text-center text-gray-500 py-16">
            <div className="relative mx-auto mb-6 w-12 h-12">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-lg font-medium">Loading conversation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] md:h-[650px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50/30 to-white overflow-hidden">
      <CardHeader className="pb-4 md:pb-5 px-5 md:px-7 bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-gray-100/80 backdrop-blur-sm">
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Work Order Discussion</span>
              <p className="text-sm text-gray-500 font-normal mt-1">Real-time collaboration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs bg-blue-50/80 text-blue-700 border-blue-200/60 px-3 py-1 font-semibold shadow-sm">
              {allMessages.length} messages
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-gray-50/30 to-white">
        {/* Messages with ScrollArea */}
        <ScrollArea className="flex-1 px-4 md:px-7 py-5">
          <div className="space-y-5 md:space-y-6 pr-4">
            {allMessages.map((message, index) => {
              const messageStyle = getMessageTypeStyle((message as any).message_type);
              const isConsecutive = index > 0 && allMessages[index - 1].user_id === message.user_id;
              
              return (
                <div 
                  key={message.id} 
                  className={`group transition-all duration-300 hover:scale-[1.01] ${
                    isConsecutive ? 'mt-2' : 'mt-6'
                  }`}
                >
                  <div className={`
                    border rounded-2xl p-5 md:p-6 transition-all duration-300 
                    ${messageStyle.bg} ${messageStyle.border} ${messageStyle.shadow}
                    hover:shadow-xl hover:border-opacity-80 transform hover:-translate-y-0.5
                  `}>
                    <div className="flex items-start gap-4 md:gap-5">
                      {!isConsecutive && (
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-3 ring-white shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold">
                              {message.users?.email ? getInitials(message.users.email) : 'SY'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xs">{messageStyle.icon}</span>
                          </div>
                        </div>
                      )}
                      
                      {isConsecutive && <div className="w-10 md:w-12 flex-shrink-0"></div>}
                      
                      <div className="flex-1 min-w-0">
                        {!isConsecutive && (
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="font-bold text-base md:text-lg text-gray-900">
                              {message.users?.email?.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'System'}
                            </span>
                            {(message as any).message_type && (message as any).message_type !== 'text' && (
                              <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm border-0 shadow-sm px-2 py-1">
                                {(message as any).message_type.replace('_', ' ')}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">{formatMessageTime(message.created_at)}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/60">
                          <p className="text-sm md:text-base text-gray-800 leading-relaxed break-words">
                            {message.message}
                          </p>
                        </div>
                        
                        {(message as any).attachments && (message as any).attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(message as any).attachments.map((attachment: string, index: number) => (
                              <div key={index} className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 text-sm hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer">
                                <Paperclip className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                                <span className="truncate max-w-32 md:max-w-none font-medium text-gray-700 group-hover:text-gray-900">
                                  {attachment}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg">
                              <Reply className="w-3 h-3 mr-2" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded-lg">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <CheckCheck className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex items-center gap-4 px-5 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 text-sm text-gray-600 shadow-sm animate-fade-in">
                <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white text-xs font-semibold">
                    ZB
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">Zach Brown is typing</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Message Input */}
        <div className="border-t border-gray-200/80 p-5 md:p-6 bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
              <Image className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-14 text-sm md:text-base h-11 border-gray-300/80 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              />
              <Button 
                size="sm" 
                className="absolute right-1.5 top-1.5 h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || createMessage.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span className="hidden sm:block font-medium">Press Enter to send • Shift+Enter for new line</span>
            <span className="sm:hidden font-medium">Enter to send</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold transition-colors duration-200 ${
                newMessage.length > 450 ? 'text-red-500' : newMessage.length > 350 ? 'text-yellow-500' : 'text-gray-500'
              }`}>
                {newMessage.length}/500
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
