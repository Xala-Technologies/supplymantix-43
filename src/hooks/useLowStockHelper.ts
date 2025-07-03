
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { purchaseOrdersApi } from "@/lib/database/purchase-orders";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type InventoryItem = Database["public"]["Tables"]["parts_items"]["Row"];

export const useCheckOrCreateLowStockPO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryItem: InventoryItem) => {
      console.log("Checking for low stock PO creation:", inventoryItem);
      
      if (!inventoryItem.min_quantity || inventoryItem.quantity > inventoryItem.min_quantity) {
        return null; // Not low stock
      }

      // Check if there's already a PO for this item in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: existingPOs, error: queryError } = await supabase
        .from("purchase_orders")
        .select(`
          id,
          purchase_order_line_items (
            inventory_item_id
          )
        `)
        .eq("status", "draft")
        .gte("created_at", sevenDaysAgo.toISOString());

      if (queryError) {
        console.error("Error checking existing POs:", queryError);
        throw queryError;
      }

      // Check if any existing PO contains this inventory item
      const hasExistingPO = existingPOs?.some(po => 
        po.purchase_order_line_items.some(item => 
          item.inventory_item_id === inventoryItem.id
        )
      );

      if (hasExistingPO) {
        console.log("PO already exists for this item within 7 days");
        return null;
      }

      // Create new PO
      const reorderQuantity = Math.max(
        (inventoryItem.min_quantity * 2) - inventoryItem.quantity,
        1
      );

      const poNumber = `AUTO-${Date.now().toString().slice(-6)}`;
      
      const newPO = await purchaseOrdersApi.createPurchaseOrder({
        vendor: "Auto-Reorder Vendor", // Use string vendor
        po_number: poNumber,
        notes: `Auto-generated for low stock item: ${inventoryItem.name}`,
        line_items: [{
          inventory_item_id: inventoryItem.id,
          description: inventoryItem.name,
          quantity: reorderQuantity,
          unit_price: inventoryItem.unit_cost || 0
        }]
      });

      return newPO;
    },
    onSuccess: (result, inventoryItem) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
        toast.success(`Low-stock PO drafted for ${inventoryItem.name}`);
      }
    },
    onError: (error) => {
      console.error("Failed to create low-stock PO:", error);
      toast.error("Failed to create low-stock purchase order");
    },
  });
};
