
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrderAttachmentsProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderAttachments = ({ purchaseOrder }: PurchaseOrderAttachmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No attachments available.
        </p>
      </CardContent>
    </Card>
  );
};
