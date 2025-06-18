
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrderApprovalsProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderApprovals = ({ purchaseOrder }: PurchaseOrderApprovalsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Approval workflow not yet implemented.
        </p>
      </CardContent>
    </Card>
  );
};
