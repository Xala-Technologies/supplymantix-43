
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

interface WorkOrderChatProps {
  workOrderId: string;
}

export const WorkOrderChat = ({ workOrderId }: WorkOrderChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Zach Brown',
      message: 'Starting work on the wrapper malfunction. Will update with progress.',
      timestamp: '2023-10-05T10:30:00Z',
      isCurrentUser: true
    },
    {
      id: '2',
      user: 'Maintenance Team 1',
      message: 'Safety inspection completed. All clear to proceed.',
      timestamp: '2023-10-05T09:15:00Z',
      isCurrentUser: false
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: 'Current User',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Work Order Communication
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!message.isCurrentUser && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {message.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!message.isCurrentUser && (
                  <div className="text-xs font-medium mb-1">{message.user}</div>
                )}
                <div className="text-sm">{message.message}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {format(new Date(message.timestamp), 'MMM dd, h:mm a')}
                </div>
              </div>
              
              {message.isCurrentUser && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {message.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
