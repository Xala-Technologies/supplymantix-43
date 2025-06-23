
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";
import { purchaseOrdersApi } from "@/lib/database/purchase-orders";
import { toast } from "sonner";
import { getCurrentTenantId } from "./useInventoryHelpers";

export const useCreateReorderPO = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: Array<{
      id: string;
      name: string;
      quantity: number;
      min_quantity: number;
      unit_cost: number;
      reorder_quantity: number;
    }>) => {
      console.log('Creating reorder PO for items:', items);
      
      const tenantId = await getCurrentTenantId();
      const poNumber = `AUTO-${Date.now().toString().slice(-8)}`;
      
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.reorder_quantity * (item.unit_cost || 0)), 0
      );
      
      // Create purchase order
      const purchaseOrder = await purchaseOrdersApi.createPurchaseOrder({
        vendor: "Auto-Reorder Supplier",
        po_number: poNumber,
        notes: `Auto-generated reorder for ${items.length} low stock items`,
        line_items: items.map(item => ({
          inventory_item_id: item.id,
          description: `${item.name} - Reorder (Current: ${item.quantity}, Min: ${item.min_quantity})`,
          quantity: item.reorder_quantity,
          unit_price: item.unit_cost || 0
        }))
      });
      
      console.log('Reorder PO created:', purchaseOrder);
      return purchaseOrder;
    },
    onSuccess: (data, items) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
      
      toast.success(`Reorder PO ${data.po_number} created for ${items.length} items`);
    },
    onError: (error) => {
      console.error("Failed to create reorder PO:", error);
      toast.error("Failed to create reorder purchase order: " + (error as Error).message);
    },
  });
};

export const useCalculateReorderQuantity = () => {
  return (item: { quantity: number; min_quantity?: number }) => {
    const minQty = item.min_quantity || 0;
    const currentQty = item.quantity || 0;
    
    // Economic Order Quantity calculation (simplified)
    // Reorder to bring stock to 2x minimum quantity
    const targetStock = Math.max(minQty * 2, 10); // At least 10 units
    const reorderQty = Math.max(targetStock - currentQty, 1);
    
    return reorderQty;
  };
};

export const useAutoReorderCheck = () => {
  const createReorderPO = useCreateReorderPO();
  const calculateReorderQty = useCalculateReorderQuantity();
  
  return useMutation({
    mutationFn: async (inventoryItems: Array<{
      id: string;
      name: string;
      quantity: number;
      min_quantity?: number;
      unit_cost?: number;
    }>) => {
      console.log('Checking items for auto-reorder:', inventoryItems);
      
      // Filter items that need reordering
      const itemsToReorder = inventoryItems.filter(item => {
        const minQty = item.min_quantity || 0;
        return item.quantity <= minQty && minQty > 0;
      });
      
      console.log('Items needing reorder:', itemsToReorder);
      
      if (itemsToReorder.length === 0) {
        return { message: "No items need reordering" };
      }
      
      // Calculate reorder quantities
      const reorderItems = itemsToReorder.map(item => ({
        ...item,
        reorder_quantity: calculateReorderQty(item)
      }));
      
      // Create reorder PO
      return await createReorderPO.mutateAsync(reorderItems);
    },
    onSuccess: (result) => {
      if ('message' in result) {
        toast.info(result.message);
      } else {
        toast.success("Auto-reorder completed successfully");
      }
    },
    onError: (error) => {
      console.error("Auto-reorder failed:", error);
      toast.error("Auto-reorder failed: " + (error as Error).message);
    },
  });
};
