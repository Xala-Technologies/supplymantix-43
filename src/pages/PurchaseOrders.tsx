
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PurchaseOrdersHeader } from "@/components/purchase-orders/PurchaseOrdersHeader";
import { PurchaseOrdersList } from "@/components/purchase-orders/PurchaseOrdersList";
import { usePurchaseOrders, useDeletePurchaseOrder } from "@/hooks/usePurchaseOrders";
import { PurchaseOrder, PurchaseOrderLineItem } from "@/types/purchaseOrder";

export default function PurchaseOrders() {
  const { data: purchaseOrdersData, isLoading, error } = usePurchaseOrders();
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

  // Transform the data to match PurchaseOrder interface
  const purchaseOrders: PurchaseOrder[] = (purchaseOrdersData || []).map(po => {
    // Transform line_items from Json to proper array
    let lineItems: PurchaseOrderLineItem[] = [];
    if (Array.isArray(po.line_items)) {
      lineItems = po.line_items
        .filter((item): item is any => item !== null && typeof item === 'object')
        .map((item: any, index: number) => ({
          id: item.id || `temp-${index}`,
          purchase_order_id: po.id,
          inventory_item_id: item.inventory_item_id,
          description: item.description || `Item ${index + 1}`,
          quantity: item.quantity || 0,
          unit_price: item.unit_price || 0,
          total_amount: (item.quantity || 0) * (item.unit_price || 0),
          created_at: item.created_at || new Date().toISOString(),
        }));
    }

    return {
      ...po,
      line_items: lineItems
    } as PurchaseOrder;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PurchaseOrdersHeader />
        <PurchaseOrdersList 
          purchaseOrders={purchaseOrders} 
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
