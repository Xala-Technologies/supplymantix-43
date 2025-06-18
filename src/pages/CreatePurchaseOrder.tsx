
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
    console.log("=== CreatePurchaseOrder handleSubmit START ===");
    console.log("Form data received:", data);
    
    try {
      console.log("Calling createPurchaseOrder mutation...");
      const result = await createPurchaseOrder.mutateAsync(data);
      console.log("Mutation completed successfully:", result);
      
      toast.success("Purchase order created successfully!");
      console.log("Navigating to purchase orders list...");
      navigate("/dashboard/purchase-orders");
      
    } catch (error) {
      console.error("=== CreatePurchaseOrder handleSubmit ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to create purchase order: ${errorMessage}`);
    }
    
    console.log("=== CreatePurchaseOrder handleSubmit END ===");
  };

  return (
    <DashboardLayout>
      <div className="space-responsive max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/purchase-orders")}
            className="self-start sm:self-auto btn-responsive hover-ultra-soft"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Purchase Orders</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create a new purchase order to track vendor orders and deliveries
          </p>
          {inventoryItemId && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm text-primary font-medium">
              Pre-filled with low stock item for reordering
            </div>
          )}
        </div>

        <div className="glass-card-ultra card-padding-responsive">
          <PurchaseOrderForm
            initialLineItems={initialLineItems}
            onSubmit={handleSubmit}
            isLoading={createPurchaseOrder.isPending}
            mode="create"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
