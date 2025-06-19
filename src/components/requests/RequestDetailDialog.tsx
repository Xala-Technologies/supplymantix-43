import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, User, DollarSign, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useRequestComments, useAddRequestComment, useUpdateRequest } from "@/hooks/useRequests";
import type { Request } from "@/types/request";

interface RequestDetailDialogProps {
  request: Request | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RequestDetailDialog = ({ request, open, onOpenChange }: RequestDetailDialogProps) => {
  const [newComment, setNewComment] = useState("");
  const [statusUpdate, setStatusUpdate] = useState(request?.status || "");

  const { data: comments = [] } = useRequestComments(request?.id || "");
  const addComment = useAddRequestComment();
  const updateRequest = useUpdateRequest();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddComment = () => {
    if (!request || !newComment.trim()) return;
    
    addComment.mutate(
      { requestId: request.id, comment: newComment },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  const handleStatusUpdate = () => {
    if (!request || statusUpdate === request.status) return;
    
    updateRequest.mutate({
      id: request.id,
      status: statusUpdate as any,
    });
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{request.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Status & Priority</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </div>
              </div>

              {request.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{request.description}</p>
                </div>
              )}

              {request.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-gray-600">{request.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                {request.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{request.location}</span>
                  </div>
                )}

                {request.due_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Due: {format(new Date(request.due_date), "PPP")}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Created: {format(new Date(request.created_at), "PPP")}</span>
                </div>

                {request.estimated_cost && request.estimated_cost > 0 && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>Estimated Cost: ${request.estimated_cost.toFixed(2)}</span>
                  </div>
                )}

                {request.actual_cost && request.actual_cost > 0 && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>Actual Cost: ${request.actual_cost.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex items-center space-x-2">
                  <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {statusUpdate !== request.status && (
                    <Button
                      size="sm"
                      onClick={handleStatusUpdate}
                      disabled={updateRequest.isPending}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment */}
            <div className="space-y-3 mb-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || addComment.isPending}
                size="sm"
              >
                Add Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(comment.created_at), "PPP 'at' p")}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailDialog;
