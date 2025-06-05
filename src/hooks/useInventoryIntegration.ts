
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";

export const useInventoryIntegration = () => {
  return useQuery({
    queryKey: ["inventory-integration"],
    queryFn: async () => {
      const [inventory, purchaseOrders] = await Promise.all([
        databaseApi.getInventoryItems(),
        databaseApi.getPurchaseOrders()
      ]);
      
      return inventory.map(item => {
        const isLowStock = item.quantity <= (item.min_quantity || 0);
        const pendingOrders = purchaseOrders.filter(po => 
          po.status === 'pending' && 
          po.line_items && JSON.parse(po.line_items as string)?.some((li: any) => li.inventory_item_id === item.id)
        );
        
        const lineItems = (po: any) => po.line_items ? JSON.parse(po.line_items as string) : [];
        
        return {
          ...item,
          isLowStock,
          needsReorder: isLowStock && pendingOrders.length === 0,
          pendingQuantity: pendingOrders.reduce((sum, po) => 
            sum + (lineItems(po)?.find((li: any) => li.inventory_item_id === item.id)?.quantity || 0), 0
          ),
          totalValue: (item.quantity || 0) * (item.unit_cost || 0),
          usageHistory: [], // Would fetch from work_order_parts_used
          reorderSuggestion: Math.max((item.min_quantity || 0) * 2 - (item.quantity || 0), 0)
        };
      });
    },
  });
};

export const useCreateReorderPO = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lowStockItems: any[]) => {
      const lineItems = lowStockItems.map(item => ({
        inventory_item_id: item.id,
        quantity: item.reorderSuggestion,
        unit_price: item.unit_cost || 0,
      }));
      
      return databaseApi.createPurchaseOrder({
        vendor: 'Auto-Generated Supplier',
        po_number: `PO-${Date.now()}`,
        notes: 'Auto-generated for low stock items',
        line_items: lineItems,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-integration"] });
      toast.success("Reorder purchase order created");
    }
  });
};
