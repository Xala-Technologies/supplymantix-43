
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PurchaseOrdersHeader } from "@/components/purchase-orders/PurchaseOrdersHeader";
import { PurchaseOrdersList } from "@/components/purchase-orders/PurchaseOrdersList";
import { usePurchaseOrders, useDeletePurchaseOrder } from "@/hooks/usePurchaseOrders";

export default function PurchaseOrders() {
  const { data: purchaseOrders, isLoading, error } = usePurchaseOrders();
  const deletePurchaseOrder = useDeletePurchaseOrder();

  const handleDelete = (id: string) => {
    deletePurchaseOrder.mutate(id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 sm:py-12">
          <div className="glass-card-ultra card-padding-responsive max-w-md mx-auto">
            <p className="text-destructive text-sm sm:text-base">
              Error loading purchase orders: {error.message}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-responsive">
        <PurchaseOrdersHeader />
        <PurchaseOrdersList 
          purchaseOrders={purchaseOrders || []} 
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
