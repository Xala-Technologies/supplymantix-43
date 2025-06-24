
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

export const useAutoReorderCheck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: InventoryItemWithStats[]) => {
      console.log('Running auto reorder check for items:', items);
      
      const lowStockItems = items.filter(item => item.is_low_stock);
      console.log('Found low stock items:', lowStockItems);
      
      if (lowStockItems.length === 0) {
        toast.info("No items need reordering at this time");
        return;
      }
      
      // For now, just show a summary - in the future this could create purchase orders
      const summary = lowStockItems.map(item => 
        `${item.name}: ${item.quantity} remaining (min: ${item.min_quantity})`
      ).join('\n');
      
      console.log('Auto reorder summary:', summary);
      toast.success(`Found ${lowStockItems.length} items that need reordering`, {
        description: "Review the inventory list to see which items need attention."
      });
      
      return lowStockItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock-alerts"] });
    },
    onError: (error) => {
      console.error("Auto reorder check failed:", error);
      toast.error("Failed to check reorder status");
    }
  });
};

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
      
      // Simulate PO creation - in a real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        po_number: `PO-${Date.now()}`,
        items: items,
        total_amount: items.reduce((sum, item) => sum + (item.reorder_quantity * item.unit_cost), 0)
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success(`Purchase Order ${data.po_number} created successfully`);
    },
    onError: (error) => {
      console.error("Failed to create reorder PO:", error);
      toast.error("Failed to create purchase order");
    }
  });
};

export const useCalculateReorderQuantity = () => {
  return (item: InventoryItemWithStats): number => {
    const minQty = item.min_quantity || 0;
    const currentQty = item.quantity || 0;
    
    // Calculate suggested reorder quantity
    // Reorder enough to reach 2x minimum quantity
    const targetQty = minQty * 2;
    const reorderQty = Math.max(0, targetQty - currentQty);
    
    return reorderQty;
  };
};
