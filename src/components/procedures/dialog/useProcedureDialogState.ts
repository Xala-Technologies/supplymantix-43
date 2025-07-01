
import { useDialogState } from './useDialogState';
import { useFieldOperations } from './useFieldOperations';
import { useTagOperations } from './useTagOperations';

export const useProcedureDialogState = (procedure: any, open: boolean, onEdit: (procedure: any) => void) => {
  const {
    isEditing,
    editData,
    formData,
    newTag,
    isSaving,
    setEditData,
    setNewTag,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleEditDataChange,
    handleFieldChange
  } = useDialogState(procedure, open, onEdit);

  const {
    addField,
    updateField,
    removeField,
    moveField
  } = useFieldOperations(editData, setEditData, procedure?.id || '');

  const {
    addTag,
    removeTag
  } = useTagOperations(editData, setEditData, newTag, setNewTag);

  return {
    isEditing,
    editData,
    formData,
    newTag,
    isSaving,
    setNewTag,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleEditDataChange,
    handleFieldChange,
    addTag,
    removeTag,
    addField,
    updateField,
    removeField,
    moveField
  };
};
