
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PurchaseOrderForm } from "@/components/purchase-orders/PurchaseOrderForm";
import { useCreatePurchaseOrder } from "@/hooks/usePurchaseOrders";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const createPurchaseOrder = useCreatePurchaseOrder();

  const handleSubmit = (data: any) => {
    createPurchaseOrder.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard/purchase-orders");
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/purchase-orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-muted-foreground">
            Create a new purchase order to track vendor orders and deliveries
          </p>
        </div>

        <PurchaseOrderForm
          onSubmit={handleSubmit}
          isLoading={createPurchaseOrder.isPending}
          mode="create"
        />
      </div>
    </DashboardLayout>
  );
}
