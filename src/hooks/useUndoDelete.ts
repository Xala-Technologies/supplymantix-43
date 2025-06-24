
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UndoItem<T> {
  item: T;
  timestamp: number;
  onUndo: () => Promise<void>;
}

interface DeleteHistoryItem<T> {
  id: string;
  item: T;
  deletedAt: number;
  itemName: string;
  canUndo: boolean;
}

export function useUndoDelete<T>(timeoutMs: number = 10000) {
  const [undoItems, setUndoItems] = useState<Map<string, UndoItem<T>>>(new Map());
  const [deleteHistory, setDeleteHistory] = useState<DeleteHistoryItem<T>[]>([]);

  const addUndoItem = useCallback((
    id: string, 
    item: T, 
    onUndo: () => Promise<void>,
    itemName?: string
  ) => {
    const undoItem: UndoItem<T> = {
      item,
      timestamp: Date.now(),
      onUndo
    };

    setUndoItems(prev => new Map(prev).set(id, undoItem));

    // Add to delete history
    const historyItem: DeleteHistoryItem<T> = {
      id,
      item,
      deletedAt: Date.now(),
      itemName: itemName || 'Item',
      canUndo: true
    };

    setDeleteHistory(prev => [historyItem, ...prev]);

    // Show toast with undo option
    const toastId = toast.success(`${itemName || 'Item'} deleted`, {
      description: 'Click undo to restore the item',
      action: {
        label: 'Undo',
        onClick: async () => {
          try {
            await onUndo();
            
            // Remove from undo items
            setUndoItems(prev => {
              const newMap = new Map(prev);
              newMap.delete(id);
              return newMap;
            });

            // Update history to mark as restored
            setDeleteHistory(prev => 
              prev.map(h => 
                h.id === id ? { ...h, canUndo: false } : h
              )
            );

            toast.success(`${itemName || 'Item'} restored`);
          } catch (error) {
            console.error('Undo failed:', error);
            toast.error('Failed to restore item');
          }
        }
      },
      duration: timeoutMs,
    });

    // Auto-remove after timeout
    setTimeout(() => {
      setUndoItems(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });

      // Update history to mark undo as no longer available
      setDeleteHistory(prev => 
        prev.map(h => 
          h.id === id ? { ...h, canUndo: false } : h
        )
      );
    }, timeoutMs);

    return toastId;
  }, [timeoutMs]);

  const removeUndoItem = useCallback((id: string) => {
    setUndoItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const isUndoAvailable = useCallback((id: string) => {
    return undoItems.has(id);
  }, [undoItems]);

  const undoFromHistory = useCallback(async (historyItem: DeleteHistoryItem<T>) => {
    if (!historyItem.canUndo) return;

    const undoItem = undoItems.get(historyItem.id);
    if (!undoItem) return;

    try {
      await undoItem.onUndo();
      
      setUndoItems(prev => {
        const newMap = new Map(prev);
        newMap.delete(historyItem.id);
        return newMap;
      });

      setDeleteHistory(prev => 
        prev.map(h => 
          h.id === historyItem.id ? { ...h, canUndo: false } : h
        )
      );

      toast.success(`${historyItem.itemName} restored from history`);
    } catch (error) {
      console.error('Undo from history failed:', error);
      toast.error('Failed to restore item from history');
    }
  }, [undoItems]);

  const clearHistory = useCallback(() => {
    setDeleteHistory([]);
  }, []);

  return {
    addUndoItem,
    removeUndoItem,
    isUndoAvailable,
    deleteHistory,
    undoFromHistory,
    clearHistory
  };
}
