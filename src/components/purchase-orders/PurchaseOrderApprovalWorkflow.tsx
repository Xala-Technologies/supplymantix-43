
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Send,
  User
} from "lucide-react";
import { useState } from "react";
import { PurchaseOrder, PurchaseOrderApproval } from "@/types/purchaseOrder";
import { formatDate } from "@/lib/utils";
import { usePurchaseOrderApprovals, useApproveOrRejectPurchaseOrder, useSubmitForApproval } from "@/hooks/usePurchaseOrdersEnhanced";

interface PurchaseOrderApprovalWorkflowProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderApprovalWorkflow = ({ purchaseOrder }: PurchaseOrderApprovalWorkflowProps) => {
  const { data: approvals, isLoading } = usePurchaseOrderApprovals(purchaseOrder.id);
  const submitForApproval = useSubmitForApproval();
  const approveOrReject = useApproveOrRejectPurchaseOrder();
  
  const [submitComment, setSubmitComment] = useState("");
  const [approvalComments, setApprovalComments] = useState<{[key: string]: string}>({});

  const canSubmitForApproval = purchaseOrder.status === 'draft' || purchaseOrder.status === 'pending';
  const isPendingApproval = purchaseOrder.status === 'pending_approval';
  const isApproved = purchaseOrder.status === 'approved';
  const isRejected = purchaseOrder.status === 'rejected';

  const handleSubmitForApproval = async () => {
    try {
      await submitForApproval.mutateAsync({
        id: purchaseOrder.id,
        comment: submitComment
      });
      setSubmitComment("");
    } catch (error) {
      console.error("Failed to submit for approval:", error);
    }
  };

  const handleApprovalDecision = async (approval: PurchaseOrderApproval, decision: 'approved' | 'rejected') => {
    if (!approval.rule?.id) return;
    
    try {
      await approveOrReject.mutateAsync({
        purchase_order_id: purchaseOrder.id,
        rule_id: approval.rule.id,
        decision,
        comments: approvalComments[approval.id] || ""
      });
      setApprovalComments(prev => ({...prev, [approval.id]: ""}));
    } catch (error) {
      console.error("Failed to process approval:", error);
    }
  };

  const getStatusIcon = (approval: PurchaseOrderApproval) => {
    switch (approval.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Approval Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Submit for Approval Section */}
        {canSubmitForApproval && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Submit for Approval</h4>
            <p className="text-sm text-blue-700 mb-3">
              This purchase order requires approval before it can be processed.
            </p>
            <Textarea
              placeholder="Add a comment for approvers (optional)"
              value={submitComment}
              onChange={(e) => setSubmitComment(e.target.value)}
              className="mb-3"
            />
            <Button 
              onClick={handleSubmitForApproval}
              disabled={submitForApproval.isPending}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitForApproval.isPending ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        )}

        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Approval Status:</span>
          <div className="flex items-center gap-2">
            {isApproved && <CheckCircle className="h-5 w-5 text-green-600" />}
            {isRejected && <XCircle className="h-5 w-5 text-red-600" />}
            {isPendingApproval && <Clock className="h-5 w-5 text-yellow-600" />}
            <span className="font-medium capitalize">{purchaseOrder.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Approval History */}
        {approvals && approvals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Approval History</h4>
            {approvals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(approval)}
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {approval.approver?.first_name} {approval.approver?.last_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({approval.approver?.email})
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {approval.rule?.name} - ${approval.rule?.min_amount}
                        {approval.rule?.max_amount ? ` - $${approval.rule.max_amount}` : '+'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(approval.status)}
                </div>

                {approval.comments && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{approval.comments}</p>
                  </div>
                )}

                {approval.status === 'pending' && (
                  <div className="space-y-3 pt-3 border-t">
                    <Textarea
                      placeholder="Add comments for your decision"
                      value={approvalComments[approval.id] || ""}
                      onChange={(e) => setApprovalComments(prev => ({
                        ...prev,
                        [approval.id]: e.target.value
                      }))}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprovalDecision(approval, 'approved')}
                        disabled={approveOrReject.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleApprovalDecision(approval, 'rejected')}
                        disabled={approveOrReject.isPending}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {approval.approved_at 
                    ? `${approval.status === 'approved' ? 'Approved' : 'Rejected'} on ${formatDate(approval.approved_at)}`
                    : `Submitted on ${formatDate(approval.created_at)}`
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Approvals Required */}
        {(!approvals || approvals.length === 0) && !canSubmitForApproval && (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No approval workflow required for this purchase order.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
