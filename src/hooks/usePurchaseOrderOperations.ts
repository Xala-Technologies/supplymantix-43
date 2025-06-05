
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useIncrementInventoryFromPO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (poId: string) => {
      console.log("Incrementing inventory from PO:", poId);
      const { error } = await supabase.rpc('increment_inventory_from_po', {
        po_id: poId
      });
      
      if (error) {
        console.error("Error incrementing inventory:", error);
        throw error;
      }
    },
    onSuccess: (_, poId) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      queryClient.invalidateQueries({ queryKey: ["purchaseOrder", poId] });
      
      toast.success("Inventory updated from purchase order");
    },
    onError: (error) => {
      console.error("Failed to increment inventory:", error);
      toast.error("Failed to update inventory from purchase order");
    },
  });
};

export const useDecrementInventoryAndLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      inventoryItemId, 
      quantity, 
      workOrderId, 
      notes = '' 
    }: {
      inventoryItemId: string;
      quantity: number;
      workOrderId: string;
      notes?: string;
    }) => {
      console.log("Decrementing inventory:", { inventoryItemId, quantity, workOrderId });
      const { error } = await supabase.rpc('decrement_inventory_and_log', {
        inv_item_id: inventoryItemId,
        qty_used: quantity,
        wo_id: workOrderId,
        usage_notes: notes
      });
      
      if (error) {
        console.error("Error decrementing inventory:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["workOrderDetails", variables.workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["workOrderPartsUsed", variables.workOrderId] });
      
      toast.success(`Inventory decremented: ${variables.quantity} units used`);
    },
    onError: (error) => {
      console.error("Failed to decrement inventory:", error);
      toast.error("Failed to update inventory usage");
    },
  });
};

export const useCopyAssetProceduresToWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, workOrderId }: { assetId: string; workOrderId: string }) => {
      console.log("Copying asset procedures to work order:", { assetId, workOrderId });
      const { error } = await supabase.rpc('copy_asset_procedures_to_work_order', {
        asset_id_param: assetId,
        work_order_id_param: workOrderId
      });
      
      if (error) {
        console.error("Error copying procedures:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["workOrderProcedures", variables.workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      
      toast.success("Default procedures copied to work order");
    },
    onError: (error) => {
      console.error("Failed to copy procedures:", error);
      toast.error("Failed to copy default procedures");
    },
  });
};
