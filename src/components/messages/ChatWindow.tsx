import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Wrench, Calendar, X, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { useSendMessage } from "@/hooks/useMessages";

const mockMessages = [
  {
    id: "1",
    sender: "John Smith",
    text: "I've completed the initial inspection. The pump seems to be working fine, but I noticed some wear on the bearings that we should address soon.",
    timestamp: "2024-06-05T10:30:00Z",
    isOwn: false
  },
  {
    id: "2", 
    sender: "You",
    text: "Thanks for the thorough update! Did you check the oil levels as well? We want to make sure everything is properly maintained.",
    timestamp: "2024-06-05T10:35:00Z",
    isOwn: true
  },
  {
    id: "3",
    sender: "John Smith", 
    text: "Yes, oil levels are good. I think we should schedule a bearing replacement within the next month though. I can create a work order for it if you'd like.",
    timestamp: "2024-06-05T10:40:00Z",
    isOwn: false
  },
  {
    id: "4",
    sender: "Sarah Johnson",
    text: "Great work John! I agree with scheduling the bearing replacement. Let's aim for next week if possible.",
    timestamp: "2024-06-05T10:45:00Z",
    isOwn: false
  }
];

export interface Participant {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: Participant[];
  workOrderId?: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
}

export const ChatWindow = ({ conversation, onClose }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: "You",
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: conversation.id,
        content: newMessage.trim()
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <Card className="h-full flex flex-col border-gray-200/60 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {conversation.participants.slice(0, 3).map((participant, index) => (
                <Avatar key={participant.id} className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarFallback className={`text-xs font-medium ${
                    index === 0 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : index === 1 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  }`}>
                    {participant.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {conversation.title}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {conversation.participants.map((p) => p.name).join(', ')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {conversation.workOrderId && (
              <Badge variant="outline" className="gap-1 border-blue-200 text-blue-700 bg-blue-50">
                <Wrench className="h-3 w-3" />
                {conversation.workOrderId}
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-700">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-700">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-700">
              <MoreVertical className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {messages.map((message, index) => {
              const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;
              const isLastFromSender = index === messages.length - 1 || messages[index + 1]?.sender !== message.sender;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} ${
                    showAvatar ? 'mt-6' : 'mt-2'
                  }`}
                >
                  <div className={`max-w-[75%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-end gap-2">
                      {!message.isOwn && showAvatar && (
                        <Avatar className="w-8 h-8 mb-1">
                          <AvatarFallback className="text-xs bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!message.isOwn && !showAvatar && (
                        <div className="w-8" />
                      )}
                      
                      <div className="flex flex-col">
                        {showAvatar && !message.isOwn && (
                          <span className="text-xs text-gray-500 mb-1 ml-3 font-medium">
                            {message.sender}
                          </span>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl relative ${
                            message.isOwn
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white ml-2'
                              : 'bg-gray-100 text-gray-900 mr-2'
                          } ${
                            isLastFromSender 
                              ? message.isOwn 
                                ? 'rounded-br-md' 
                                : 'rounded-bl-md'
                              : ''
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                          <div
                            className={`text-xs mt-2 ${
                              message.isOwn ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50/30">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 mb-1">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 mb-1">
              <Smile className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 border-gray-200 focus:border-green-300 focus:ring-green-100 bg-white"
                disabled={sendMessageMutation.isPending}
              />
              <Button 
                size="icon" 
                className={`absolute right-1 top-1 h-8 w-8 transition-all duration-200 ${
                  newMessage.trim() 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
