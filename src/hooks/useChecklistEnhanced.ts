
import { useState } from "react";
import { useChecklistItems, useCreateChecklistItem, useUpdateChecklistItem, useDeleteChecklistItem } from "./useWorkOrdersEnhanced";

export const useChecklistEnhanced = (workOrderId: string) => {
  const { data: checklistItems = [], isLoading } = useChecklistItems(workOrderId);
  const createItem = useCreateChecklistItem();
  const updateItem = useUpdateChecklistItem();
  const deleteItem = useDeleteChecklistItem();

  const toggleComplete = async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
    return updateItem.mutateAsync({
      id: itemId,
      updates: { completed }
    });
  };

  const removeItem = async (itemId: string) => {
    return deleteItem.mutateAsync(itemId);
  };

  return {
    checklistItems,
    isLoading,
    createItem: createItem.mutateAsync,
    removeItem,
    toggleComplete,
    isCreating: createItem.isPending,
    isRemoving: deleteItem.isPending,
    isToggling: updateItem.isPending,
  };
};
