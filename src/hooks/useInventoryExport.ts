
import { useMutation } from "@tanstack/react-query";
import { inventoryEnhancedApi } from "@/lib/database/inventory-enhanced";
import { toast } from "sonner";

// Export inventory
export const useExportInventory = () => {
  return useMutation({
    mutationFn: async () => {
      const { items } = await inventoryEnhancedApi.searchInventory({});
      const csvContent = [
        'Name,SKU,Description,Location,Quantity,Min Quantity,Unit Cost,Total Value',
        ...items.map(item => 
          `"${item.name}","${item.sku || ''}","${item.description || ''}","${item.location || ''}",${item.quantity},${item.min_quantity || 0},${item.unit_cost || 0},${item.total_value}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success("Inventory exported successfully");
    },
    onError: (error) => {
      console.error("Failed to export inventory:", error);
      toast.error("Failed to export inventory");
    },
  });
};
