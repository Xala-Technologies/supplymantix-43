
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { formatDate } from "@/lib/utils";

interface PurchaseOrderInfoProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderInfo = ({ purchaseOrder }: PurchaseOrderInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Order Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Vendor</label>
            <p className="text-sm">{purchaseOrder.vendor || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
            <p className="text-sm">{purchaseOrder.due_date ? formatDate(purchaseOrder.due_date) : 'Not set'}</p>
          </div>
        </div>
        
        {purchaseOrder.notes && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            <p className="text-sm mt-1">{purchaseOrder.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
