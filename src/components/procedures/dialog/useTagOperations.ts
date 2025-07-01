
import { useCallback } from 'react';

export const useTagOperations = (
  editData: any,
  setEditData: (updater: (prev: any) => any) => void,
  newTag: string,
  setNewTag: (tag: string) => void
) => {
  const addTag = useCallback(() => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      console.log('Adding tag:', newTag.trim());
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  }, [newTag, editData.tags, setEditData, setNewTag]);

  const removeTag = useCallback((tagToRemove: string) => {
    console.log('Removing tag:', tagToRemove);
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  }, [setEditData]);

  return {
    addTag,
    removeTag
  };
};
