
import { useState, useEffect, useCallback } from 'react';
import { useUpdateProcedure } from '@/hooks/useProceduresEnhanced';
import { toast } from 'sonner';
import { ProcedureField } from '@/lib/database/procedures/types';

export const useProcedureDialogState = (procedure: any, open: boolean, onEdit: (procedure: any) => void) => {
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
        fields: procedure.fields || []
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
      
      setIsEditing(false);
      toast.success('Procedure updated successfully');
      
      // Update the parent component with the complete updated data
      const fullUpdatedProcedure = {
        ...procedure,
        ...updateData,
        fields: editData.fields,
        updated_at: new Date().toISOString()
      };
      
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
      fields: procedure.fields || []
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

  const addTag = useCallback(() => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      console.log('Adding tag:', newTag.trim());
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  }, [newTag, editData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    console.log('Removing tag:', tagToRemove);
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  }, []);

  const addField = useCallback(() => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: procedure.id,
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: editData.fields.length,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenant_id: procedure.tenant_id || ''
    };

    console.log('Adding new field:', newField);
    setEditData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  }, [procedure.id, procedure.tenant_id, editData.fields.length]);

  const updateField = useCallback((index: number, updates: Partial<ProcedureField>) => {
    console.log('Updating field at index:', index, updates);
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.map((field: ProcedureField, i: number) => 
        i === index ? { ...field, ...updates, updated_at: new Date().toISOString() } : field
      )
    }));
  }, []);

  const removeField = useCallback((index: number) => {
    console.log('Removing field at index:', index);
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.filter((_: any, i: number) => i !== index).map((field: ProcedureField, i: number) => ({
        ...field,
        order_index: i
      }))
    }));
  }, []);

  const moveField = useCallback((index: number, direction: 'up' | 'down') => {
    const fields = [...editData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      console.log('Moving field from', index, 'to', targetIndex);
      [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];
      
      // Update order_index for all fields
      fields.forEach((field, i) => {
        field.order_index = i;
        field.updated_at = new Date().toISOString();
      });
      
      setEditData(prev => ({ ...prev, fields }));
    }
  }, [editData.fields]);

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
