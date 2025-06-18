
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 py-8">
          <p>Error loading purchase orders: {error.message}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PurchaseOrdersHeader />
        <PurchaseOrdersList 
          purchaseOrders={purchaseOrders || []} 
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
