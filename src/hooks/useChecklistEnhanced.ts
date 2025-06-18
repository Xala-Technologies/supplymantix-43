
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChecklistItems, useCreateChecklistItem, useUpdateChecklistItem } from "./useWorkOrdersEnhanced";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useChecklistEnhanced = (workOrderId: string) => {
  const queryClient = useQueryClient();
  const { data: checklistItems, isLoading } = useChecklistItems(workOrderId);
  const createChecklistItem = useCreateChecklistItem();
  const updateChecklistItem = useUpdateChecklistItem();

  // Reorder checklist items
  const reorderItems = useMutation({
    mutationFn: async ({ itemId, newIndex }: { itemId: string; newIndex: number }) => {
      // For now, we'll implement a simple reordering by updating created_at
      // In a full implementation, you'd want an order_index column
      const timestamp = new Date(Date.now() + newIndex * 1000).toISOString();
      
      const { data, error } = await supabase
        .from("checklist_items")
        .update({ created_at: timestamp })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", workOrderId] });
      toast.success("Checklist reordered");
    },
    onError: (error) => {
      toast.error("Failed to reorder checklist");
      console.error("Reorder error:", error);
    }
  });

  // Enhanced toggle complete with work order status updates
  const toggleCompleteEnhanced = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      // Update the checklist item
      const { data: updatedItem, error: itemError } = await supabase
        .from("checklist_items")
        .update({ completed })
        .eq("id", itemId)
        .select()
        .single();

      if (itemError) throw itemError;

      // Get current checklist state
      const { data: allItems, error: itemsError } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("work_order_id", workOrderId);

      if (itemsError) throw itemsError;

      // Calculate completion stats
      const totalItems = allItems.length;
      const completedItems = allItems.filter(item => 
        item.id === itemId ? completed : item.completed
      ).length;

      // Update work order status based on checklist completion
      let newStatus = null;
      
      if (completed && completedItems === 1) {
        // First item completed - set to in_progress
        newStatus = 'in_progress';
      } else if (completedItems === totalItems && totalItems > 0) {
        // All items completed - set to completed
        newStatus = 'completed';
      } else if (!completed && completedItems === 0) {
        // No items completed - set back to open
        newStatus = 'open';
      }

      // Update work order status if needed
      if (newStatus) {
        const { error: woError } = await supabase
          .from("work_orders")
          .update({ 
            status: newStatus as any,
            updated_at: new Date().toISOString()
          })
          .eq("id", workOrderId);

        if (woError) throw woError;
      }

      return { updatedItem, newStatus, completedItems, totalItems };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", workOrderId] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      
      if (data.newStatus) {
        toast.success(`Work order status updated to ${data.newStatus.replace('_', ' ')}`);
      }
    },
    onError: (error) => {
      toast.error("Failed to update checklist item");
      console.error("Toggle complete error:", error);
    }
  });

  // Remove checklist item
  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", workOrderId] });
      toast.success("Checklist item removed");
    },
    onError: (error) => {
      toast.error("Failed to remove checklist item");
      console.error("Remove item error:", error);
    }
  });

  return {
    checklistItems: checklistItems || [],
    isLoading,
    createItem: createChecklistItem.mutateAsync,
    updateItem: updateChecklistItem.mutateAsync,
    removeItem: removeItem.mutateAsync,
    reorderItems: reorderItems.mutateAsync,
    toggleComplete: toggleCompleteEnhanced.mutateAsync,
    isCreating: createChecklistItem.isPending,
    isUpdating: updateChecklistItem.isPending,
    isRemoving: removeItem.isPending,
    isReordering: reorderItems.isPending,
    isToggling: toggleCompleteEnhanced.isPending,
  };
};
