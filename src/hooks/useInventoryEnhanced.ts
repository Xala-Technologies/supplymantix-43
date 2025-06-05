
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { inventoryApi } from "@/lib/database/inventory";
import { useCheckOrCreateLowStockPO } from "./useLowStockHelper";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const useUpdateInventoryItemEnhanced = () => {
  const queryClient = useQueryClient();
  const checkLowStockMutation = useCheckOrCreateLowStockPO();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Tables["inventory_items"]["Update"] 
    }) => {
      console.log("Updating inventory item:", { id, updates });
      
      // First update the item
      const { data, error } = await supabase
        .from("inventory_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      // Check for low stock after update
      if (data && typeof updates.quantity === 'number') {
        const updatedItem = { ...data, quantity: updates.quantity };
        await checkLowStockMutation.mutateAsync(updatedItem);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
