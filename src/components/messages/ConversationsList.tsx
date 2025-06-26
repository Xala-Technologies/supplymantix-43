
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Wrench, Clock, Users } from "lucide-react";

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
      <Card className="h-full border-gray-200/60 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1 p-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-white" />
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="h-full border-gray-200/60 shadow-sm">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Start your first conversation to collaborate with your team on maintenance tasks and projects.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? 'Just now' : `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="h-full border-gray-200/60 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2 text-gray-900">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Conversations
          </h3>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-medium">
            {conversations.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/80 border-l-4 relative ${
                selectedId === conversation.id 
                  ? 'bg-green-50/60 border-l-green-500 shadow-sm' 
                  : 'border-l-transparent hover:border-l-gray-200'
              }`}
              onClick={() => onConversationClick(conversation)}
            >
              <div className="flex items-start gap-3">
                <div className="flex -space-x-2">
                  {conversation.participants.slice(0, 3).map((participant, index) => (
                    <Avatar key={participant.id} className="w-10 h-10 border-2 border-white shadow-sm">
                      <AvatarFallback className={`text-xs font-medium ${
                        index === 0 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : index === 1 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      }`}>
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {conversation.participants.length > 3 && (
                    <div className="w-10 h-10 border-2 border-white bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      +{conversation.participants.length - 3}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate text-gray-900 flex-1">
                      {conversation.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {conversation.workOrderId && (
                        <Wrench className="h-3 w-3 text-blue-500" />
                      )}
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                          {conversation.unread > 99 ? '99+' : conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 truncate mb-2 leading-relaxed">
                    <span className="font-medium">{conversation.lastMessage.sender}:</span> {conversation.lastMessage.text}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="h-3 w-3" />
                      {conversation.participants.length}
                    </div>
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
