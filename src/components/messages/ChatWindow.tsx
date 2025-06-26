
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Wrench, Calendar, X } from "lucide-react";

const mockMessages = [
  {
    id: "1",
    sender: "John Smith",
    text: "I've completed the initial inspection. The pump seems to be working fine, but I noticed some wear on the bearings.",
    timestamp: "2024-06-05T10:30:00Z",
    isOwn: false
  },
  {
    id: "2", 
    sender: "You",
    text: "Thanks for the update. Did you check the oil levels as well?",
    timestamp: "2024-06-05T10:35:00Z",
    isOwn: true
  },
  {
    id: "3",
    sender: "John Smith", 
    text: "Yes, oil levels are good. I think we should schedule a bearing replacement within the next month though.",
    timestamp: "2024-06-05T10:40:00Z",
    isOwn: false
  }
];

interface ChatWindowProps {
  conversation: any;
  onClose?: () => void;
}

export const ChatWindow = ({ conversation, onClose }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: "You",
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {conversation.participants.map((participant: any) => (
                  <Avatar key={participant.id} className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {participant.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {conversation.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {conversation.participants.map((p: any) => p.name).join(', ')}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {conversation.workOrderId && (
              <Badge variant="outline" className="gap-1">
                <Wrench className="h-3 w-3" />
                {conversation.workOrderId}
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-3 w-3" />
              Schedule
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.isOwn
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {!message.isOwn && (
                <Avatar className="w-8 h-8 order-1 mr-2">
                  <AvatarFallback className="text-xs bg-gray-300">
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              size="icon" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
