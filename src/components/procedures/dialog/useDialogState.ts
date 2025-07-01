
import { useState, useEffect, useCallback } from 'react';
import { useUpdateProcedure } from '@/hooks/useProceduresEnhanced';
import { toast } from 'sonner';
import { ProcedureField } from '@/lib/database/procedures/types';

export const useDialogState = (procedure: any, open: boolean, onEdit: (procedure: any) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const updateProcedure = useUpdateProcedure();

  // Reset state when dialog opens/closes or procedure changes
  useEffect(() => {
    if (procedure && open) {
      console.log('Initializing dialog state for procedure:', procedure.id);
      const initialData = {
        title: procedure.title || '',
        description: procedure.description || '',
        category: procedure.category || 'Inspection',
        tags: procedure.tags || [],
        is_global: procedure.is_global || false,
        fields: procedure.fields || procedure.procedure_fields || []
      };
      setEditData(initialData);
      setFormData({});
      setIsEditing(false);
      setIsSaving(false);
      setNewTag('');
    }
  }, [procedure?.id, open]);

  const handleEditStart = useCallback(() => {
    console.log('Starting edit mode');
    setIsEditing(true);
  }, []);

  const handleEditSave = useCallback(async () => {
    if (isSaving) {
      console.log('Save already in progress, skipping');
      return;
    }

    try {
      setIsSaving(true);
      console.log('Saving procedure changes:', editData);
      
      // Validate required fields
      if (!editData.title?.trim()) {
        toast.error('Procedure title is required');
        return;
      }

      // Prepare the update data with properly formatted fields
      const updateData = {
        title: editData.title.trim(),
        description: editData.description || '',
        category: editData.category,
        tags: editData.tags || [],
        is_global: editData.is_global || false,
        fields: (editData.fields || []).map((field: ProcedureField, index: number) => ({
          label: field.label || '',
          field_type: field.field_type,
          is_required: field.is_required || false,
          order_index: field.order_index !== undefined ? field.order_index : index,
          options: field.options || {}
        }))
      };
      
      console.log('Prepared update data:', updateData);
      
      const updatedProcedure = await updateProcedure.mutateAsync({
        id: procedure.id,
        updates: updateData
      });
      
      // Create the complete updated procedure object
      const fullUpdatedProcedure = {
        ...procedure,
        ...updateData,
        fields: editData.fields,
        updated_at: new Date().toISOString()
      };
      
      // Update the local edit data to reflect the saved state
      setEditData(fullUpdatedProcedure);
      setIsEditing(false);
      toast.success('Procedure updated successfully');
      
      // Notify parent component with the complete updated data
      console.log('Notifying parent of update:', fullUpdatedProcedure);
      onEdit(fullUpdatedProcedure);
      
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast.error('Failed to save procedure changes');
    } finally {
      setIsSaving(false);
    }
  }, [editData, procedure, updateProcedure, onEdit, isSaving]);

  const handleEditCancel = useCallback(() => {
    console.log('Cancelling edit mode');
    // Reset to original data
    setEditData({
      title: procedure.title || '',
      description: procedure.description || '',
      category: procedure.category || 'Inspection',
      tags: procedure.tags || [],
      is_global: procedure.is_global || false,
      fields: procedure.fields || procedure.procedure_fields || []
    });
    setIsEditing(false);
    setIsSaving(false);
  }, [procedure]);

  const handleEditDataChange = useCallback((updates: any) => {
    console.log('Updating edit data:', updates);
    setEditData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    console.log('Field value changed:', fieldId, value);
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  return {
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
  };
};
