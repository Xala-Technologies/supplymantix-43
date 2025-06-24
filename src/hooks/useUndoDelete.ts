
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UndoItem<T> {
  item: T;
  timestamp: number;
  onUndo: () => Promise<void>;
}

export function useUndoDelete<T>(timeoutMs: number = 10000) {
  const [undoItems, setUndoItems] = useState<Map<string, UndoItem<T>>>(new Map());

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

    // Show toast with undo option
    const toastId = toast.success(`${itemName || 'Item'} deleted`, {
      description: 'Click undo to restore the item',
      action: {
        label: 'Undo',
        onClick: async () => {
          try {
            await onUndo();
            setUndoItems(prev => {
              const newMap = new Map(prev);
              newMap.delete(id);
              return newMap;
            });
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

  return {
    addUndoItem,
    removeUndoItem,
    isUndoAvailable
  };
}
