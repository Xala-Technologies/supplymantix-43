
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PurchaseOrderForm } from "@/components/purchase-orders/PurchaseOrderForm";
import { purchaseOrdersApi } from "@/lib/database/purchase-orders";
import { useInventoryItems } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data: inventoryItems } = useInventoryItems();

  // Get prefill data from URL params
  const inventoryItemId = searchParams.get('inventory_item_id');
  const quantity = searchParams.get('quantity');

  const [initialLineItems, setInitialLineItems] = useState<any[]>([]);

  const createPurchaseOrder = useMutation({
    mutationFn: (data: any) => {
      console.log("Creating purchase order with data:", data);
      return purchaseOrdersApi.createPurchaseOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order created successfully");
      navigate("/dashboard/purchase-orders");
    },
    onError: (error: Error) => {
      console.error("Failed to create purchase order:", error);
      toast.error(`Failed to create purchase order: ${error.message}`);
    }
  });

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

  const handleSubmit = (data: any) => {
    console.log("Submitting purchase order:", data);
    createPurchaseOrder.mutate(data);
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
