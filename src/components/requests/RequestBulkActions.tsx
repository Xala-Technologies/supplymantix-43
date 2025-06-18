
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, CheckCircle, XCircle, Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RequestBulkActionsProps {
  selectedRequests: string[];
  onClearSelection: () => void;
  userRole?: 'admin' | 'user';
}

export const RequestBulkActions = ({ 
  selectedRequests, 
  onClearSelection, 
  userRole = 'user' 
}: RequestBulkActionsProps) => {
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'decline' | 'cancel' | 'delete'>('approve');
  const [bulkActionReason, setBulkActionReason] = useState("");

  const handleBulkAction = (action: 'approve' | 'decline' | 'cancel' | 'delete') => {
    setBulkActionType(action);
    setBulkActionDialogOpen(true);
  };

  const executeBulkAction = () => {
    if ((bulkActionType === 'decline' || bulkActionType === 'cancel') && !bulkActionReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    // Here you would implement the actual bulk action API calls
    const actionLabels = {
      approve: 'approved',
      decline: 'declined',
      cancel: 'cancelled',
      delete: 'deleted'
    };

    toast.success(`${selectedRequests.length} requests ${actionLabels[bulkActionType]}`);
    setBulkActionDialogOpen(false);
    setBulkActionReason("");
    onClearSelection();
  };

  if (selectedRequests.length === 0) return null;

  const getDialogTitle = () => {
    const actionLabels = {
      approve: 'Approve',
      decline: 'Decline',
      cancel: 'Cancel',
      delete: 'Delete'
    };
    return `${actionLabels[bulkActionType]} ${selectedRequests.length} Request${selectedRequests.length > 1 ? 's' : ''}`;
  };

  const needsReason = bulkActionType === 'decline' || bulkActionType === 'cancel';

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm font-medium text-blue-900">
          {selectedRequests.length} request{selectedRequests.length > 1 ? 's' : ''} selected
        </span>
        
        {userRole === 'admin' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('decline')}>
                <XCircle className="h-4 w-4 mr-2" />
                Decline All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('cancel')}>
                <Ban className="h-4 w-4 mr-2" />
                Cancel All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleBulkAction('delete')}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>

      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {bulkActionType} {selectedRequests.length} request{selectedRequests.length > 1 ? 's' : ''}?
            </p>
            {needsReason && (
              <div>
                <label className="text-sm font-medium">
                  Reason {bulkActionType === 'decline' ? 'for declining' : 'for canceling'}:
                </label>
                <Textarea
                  placeholder={`Enter ${bulkActionType} reason...`}
                  value={bulkActionReason}
                  onChange={(e) => setBulkActionReason(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={executeBulkAction}>
              {getDialogTitle().split(' ')[0]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
