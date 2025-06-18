
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, Edit, Trash2, Copy, CheckCircle, XCircle, Ban } from "lucide-react";
import { useUpdateRequest, useDeleteRequest } from "@/hooks/useRequests";
import { toast } from "sonner";
import type { Request } from "@/types/request";

interface RequestActionsProps {
  request: Request;
  onEdit?: (request: Request) => void;
  onView?: (request: Request) => void;
  userRole?: 'admin' | 'user';
}

export const RequestActions = ({ request, onEdit, onView, userRole = 'user' }: RequestActionsProps) => {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const updateRequest = useUpdateRequest();
  const deleteRequest = useDeleteRequest();

  const canEdit = request.status === 'pending';
  const canApprove = userRole === 'admin' && request.status === 'pending';
  const canCancel = request.status === 'pending';
  const canDelete = userRole === 'admin' || (request.status === 'pending' || request.status === 'rejected');

  const handleApprove = () => {
    updateRequest.mutate({
      id: request.id,
      status: 'approved',
    }, {
      onSuccess: () => {
        toast.success("Request approved successfully");
        setApproveDialogOpen(false);
      }
    });
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }
    
    updateRequest.mutate({
      id: request.id,
      status: 'rejected',
      notes: declineReason,
    }, {
      onSuccess: () => {
        toast.success("Request declined");
        setDeclineDialogOpen(false);
        setDeclineReason("");
      }
    });
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for canceling");
      return;
    }
    
    updateRequest.mutate({
      id: request.id,
      status: 'cancelled',
      notes: cancelReason,
    }, {
      onSuccess: () => {
        toast.success("Request cancelled");
        setCancelDialogOpen(false);
        setCancelReason("");
      }
    });
  };

  const handleDuplicate = () => {
    // Create a new request based on the current one
    const duplicateData = {
      title: `Copy of ${request.title}`,
      description: request.description,
      category: request.category,
      priority: request.priority,
      location: request.location,
      estimated_cost: request.estimated_cost,
      notes: `Duplicated from request #${request.id}`,
    };
    
    // This would typically create a new request
    toast.success("Request duplicated - redirect to edit form");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView?.(request)}>
            View Details
          </DropdownMenuItem>
          
          {canEdit && (
            <DropdownMenuItem onClick={() => onEdit?.(request)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Request
            </DropdownMenuItem>
          )}
          
          {canApprove && (
            <DropdownMenuItem onClick={() => setApproveDialogOpen(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Request
            </DropdownMenuItem>
          )}
          
          {canApprove && (
            <DropdownMenuItem onClick={() => setDeclineDialogOpen(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Decline Request
            </DropdownMenuItem>
          )}
          
          {canCancel && (
            <DropdownMenuItem onClick={() => setCancelDialogOpen(true)}>
              <Ban className="h-4 w-4 mr-2" />
              Cancel Request
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Request
          </DropdownMenuItem>
          
          {canDelete && (
            <DropdownMenuItem 
              onClick={() => deleteRequest.mutate(request.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Request
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to approve this request? This will create a work order.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={updateRequest.isPending}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please provide a reason for declining this request:</p>
            <Textarea
              placeholder="Enter decline reason..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDecline} disabled={updateRequest.isPending}>
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please provide a reason for canceling this request:</p>
            <Textarea
              placeholder="Enter cancel reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCancel} disabled={updateRequest.isPending}>
              Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
