
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Wrench } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  participants: Array<{ id: string; name: string; avatar?: string }>;
  lastMessage: {
    text: string;
    timestamp: string;
    sender: string;
  };
  unread: number;
  workOrderId?: string;
}

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedId?: string;
  onConversationClick: (conversation: Conversation) => void;
}

export const ConversationsList = ({ 
  conversations, 
  isLoading, 
  selectedId, 
  onConversationClick 
}: ConversationsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500">Start a new conversation to collaborate with your team</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversations ({conversations.length})
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                selectedId === conversation.id 
                  ? 'bg-blue-50 border-l-blue-500' 
                  : 'border-l-transparent'
              }`}
              onClick={() => onConversationClick(conversation)}
            >
              <div className="flex items-start gap-3">
                <div className="flex -space-x-2">
                  {conversation.participants.slice(0, 2).map((participant) => (
                    <Avatar key={participant.id} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
                    {conversation.workOrderId && (
                      <Wrench className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                    {conversation.unread > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-0">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {conversation.lastMessage.sender}: {conversation.lastMessage.text}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
