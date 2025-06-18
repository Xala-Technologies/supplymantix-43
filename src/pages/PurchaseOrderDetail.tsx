
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { usePurchaseOrderByIdEnhanced } from "@/hooks/usePurchaseOrdersEnhanced";
import { PurchaseOrderDetailHeader } from "@/components/purchase-orders/PurchaseOrderDetailHeader";
import { PurchaseOrderInfo } from "@/components/purchase-orders/PurchaseOrderInfo";
import { PurchaseOrderLineItems } from "@/components/purchase-orders/PurchaseOrderLineItems";
import { PurchaseOrderApprovalWorkflow } from "@/components/purchase-orders/PurchaseOrderApprovalWorkflow";
import { PurchaseOrderAttachments } from "@/components/purchase-orders/PurchaseOrderAttachments";
import { PurchaseOrderActions } from "@/components/purchase-orders/PurchaseOrderActions";

export default function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: purchaseOrder, isLoading, error } = usePurchaseOrderByIdEnhanced(id!);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 py-8">
          <p>Purchase order not found or error loading details</p>
          <button 
            onClick={() => navigate("/dashboard/purchase-orders")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Purchase Orders
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PurchaseOrderDetailHeader purchaseOrder={purchaseOrder} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PurchaseOrderInfo purchaseOrder={purchaseOrder} />
            <PurchaseOrderLineItems purchaseOrder={purchaseOrder} />
          </div>
          
          <div className="space-y-6">
            <PurchaseOrderActions purchaseOrder={purchaseOrder} />
            <PurchaseOrderApprovalWorkflow purchaseOrder={purchaseOrder} />
            <PurchaseOrderAttachments purchaseOrder={purchaseOrder} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
