
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PurchaseOrderStatusBadgeEnhanced } from "./PurchaseOrderStatusBadgeEnhanced";

interface PurchaseOrderDetailHeaderProps {
  purchaseOrder: PurchaseOrder;
}

export const PurchaseOrderDetailHeader = ({ purchaseOrder }: PurchaseOrderDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/purchase-orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{purchaseOrder.po_number}</h1>
          <div className="flex items-center gap-4 mt-1">
            <PurchaseOrderStatusBadgeEnhanced status={purchaseOrder.status} />
            <span className="text-sm text-muted-foreground">
              Created {formatDate(purchaseOrder.created_at)}
            </span>
            <span className="text-sm font-medium">
              Total: {formatCurrency(purchaseOrder.total_amount)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/purchase-orders/${purchaseOrder.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('Are you sure you want to delete this purchase order?')) {
              // Handle delete
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
