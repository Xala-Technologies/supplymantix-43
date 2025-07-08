
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User } from "lucide-react";
import { useWorkOrderComments, useCreateWorkOrderComment } from "@/hooks/useWorkOrdersEnhanced";
import { format } from "date-fns";

interface WorkOrderChatProps {
  workOrderId: string;
}

export const WorkOrderChat = ({ workOrderId }: WorkOrderChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const { data: comments = [], isLoading } = useWorkOrderComments(workOrderId);
  const createComment = useCreateWorkOrderComment();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await createComment.mutateAsync({
        work_order_id: workOrderId,
        user_id: 'current-user-id', // Will be filled by the API from auth context
        message: newMessage.trim()
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <CardTitle className="text-lg">Comments & Communication</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm">No comments yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a conversation about this work order</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.users?.first_name && comment.users?.last_name 
                        ? `${comment.users.first_name} ${comment.users.last_name}`
                        : comment.users?.email || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.created_at), 'MMM dd, yyyy h:mm a')}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-800">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newMessage.trim() || createComment.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
