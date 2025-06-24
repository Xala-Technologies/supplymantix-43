
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
