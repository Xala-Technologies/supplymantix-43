
import { useState } from "react";
import { useChecklistItems, useCreateChecklistItem, useUpdateChecklistItem } from "./useWorkOrdersEnhanced";
import { useUpdateWorkOrderStatus } from "./useWorkOrdersIntegration";

export const useChecklistEnhanced = (workOrderId: string) => {
  const { data: checklistItems = [], isLoading } = useChecklistItems(workOrderId);
  const createItem = useCreateChecklistItem();
  const updateItem = useUpdateChecklistItem();
  const updateWorkOrderStatus = useUpdateWorkOrderStatus();

  const [isCreating, setIsCreating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const createChecklistItem = async (data: any) => {
    setIsCreating(true);
    try {
      await createItem.mutateAsync(data);
    } finally {
      setIsCreating(false);
    }
  };

  const removeItem = async (id: string) => {
    setIsRemoving(true);
    try {
      // Implementation would delete the item
      console.log('Remove item:', id);
    } finally {
      setIsRemoving(false);
    }
  };

  const toggleComplete = async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
    setIsToggling(true);
    try {
      await updateItem.mutateAsync({
        id: itemId,
        updates: { completed }
      });

      // Auto-update work order status based on checklist progress
      const completedCount = checklistItems.filter(item => 
        item.id === itemId ? completed : item.completed
      ).length;
      
      const totalCount = checklistItems.length;

      // First item checked → status changes to "In Progress"
      if (completedCount === 1 && completed) {
        await updateWorkOrderStatus.mutateAsync({
          id: workOrderId,
          status: 'in_progress',
          notes: 'Work started - first checklist item completed'
        });
      }
      
      // All items completed → enable "Mark as Done"
      if (completedCount === totalCount && totalCount > 0) {
        console.log('All checklist items completed - work order can be marked as done');
      }
    } finally {
      setIsToggling(false);
    }
  };

  return {
    checklistItems,
    isLoading,
    createItem: createChecklistItem,
    removeItem,
    toggleComplete,
    isCreating,
    isRemoving,
    isToggling,
  };
};
