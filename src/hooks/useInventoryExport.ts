
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

export const useExportInventory = () => {
  return useMutation({
    mutationFn: async (items: InventoryItemWithStats[]) => {
      console.log('Exporting inventory items:', items);
      
      // Create CSV content
      const headers = ['Name', 'SKU', 'Description', 'Location', 'Quantity', 'Min Quantity', 'Unit Cost', 'Total Value', 'Status'];
      const csvContent = [
        headers.join(','),
        ...items.map(item => [
          `"${item.name || ''}"`,
          `"${item.sku || ''}"`,
          `"${item.description || ''}"`,
          `"${item.location || ''}"`,
          item.quantity || 0,
          item.min_quantity || 0,
          item.unit_cost || 0,
          item.total_value.toFixed(2),
          item.is_low_stock ? 'Low Stock' : 'In Stock'
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return items.length;
    },
    onSuccess: (count) => {
      toast.success(`Exported ${count} inventory items to CSV`);
    },
    onError: (error) => {
      console.error("Export failed:", error);
      toast.error("Failed to export inventory");
    }
  });
};
