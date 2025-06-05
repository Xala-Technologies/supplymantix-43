
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PurchaseOrderForm } from "@/components/purchase-orders/PurchaseOrderForm";
import { useInventoryItems } from "@/hooks/useInventory";
import { useCreatePurchaseOrder } from "@/hooks/usePurchaseOrders";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: inventoryItems } = useInventoryItems();
  const createPurchaseOrder = useCreatePurchaseOrder();

  // Get prefill data from URL params
  const inventoryItemId = searchParams.get('inventory_item_id');
  const quantity = searchParams.get('quantity');

  const [initialLineItems, setInitialLineItems] = useState<any[]>([]);

  useEffect(() => {
    if (inventoryItemId && quantity && inventoryItems) {
      const item = inventoryItems.find(inv => inv.id === inventoryItemId);
      if (item) {
        setInitialLineItems([{
          inventory_item_id: inventoryItemId,
          quantity: parseInt(quantity) || 1,
          unit_price: item.unit_cost || 0
        }]);
      }
    }
  }, [inventoryItemId, quantity, inventoryItems]);

  const handleSubmit = async (data: any) => {
    console.log("CreatePurchaseOrder: Submitting purchase order:", data);
    
    try {
      await createPurchaseOrder.mutateAsync(data);
      console.log("CreatePurchaseOrder: Purchase order created successfully");
      navigate("/dashboard/purchase-orders");
    } catch (error) {
      console.error("CreatePurchaseOrder: Failed to create purchase order:", error);
      toast.error(`Failed to create purchase order: ${error}`);
    }
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
          {inventoryItemId && (
            <p className="text-sm text-blue-600 mt-2">
              Pre-filled with low stock item for reordering
            </p>
          )}
        </div>

        <PurchaseOrderForm
          initialLineItems={initialLineItems}
          onSubmit={handleSubmit}
          isLoading={createPurchaseOrder.isPending}
          mode="create"
        />
      </div>
    </DashboardLayout>
  );
}
