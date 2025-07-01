
import { useState, useEffect } from 'react';
import { useUpdateProcedure } from '@/hooks/useProceduresEnhanced';
import { toast } from 'sonner';
import { ProcedureField } from '@/lib/database/procedures/types';

export const useProcedureDialogState = (procedure: any, open: boolean, onEdit: (procedure: any) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [newTag, setNewTag] = useState('');

  const updateProcedure = useUpdateProcedure();

  useEffect(() => {
    if (procedure && open) {
      setEditData({
        title: procedure.title || '',
        description: procedure.description || '',
        category: procedure.category || 'Inspection',
        tags: procedure.tags || [],
        is_global: procedure.is_global || false,
        fields: procedure.fields || []
      });
      setFormData({});
    }
  }, [procedure, open]);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    try {
      console.log('Saving procedure changes:', editData);
      
      const updatedProcedure = await updateProcedure.mutateAsync({
        id: procedure.id,
        updates: {
          title: editData.title,
          description: editData.description,
          category: editData.category,
          tags: editData.tags,
          is_global: editData.is_global
        }
      });
      
      setIsEditing(false);
      toast.success('Procedure updated successfully');
      
      onEdit({
        ...procedure,
        title: editData.title,
        description: editData.description,
        category: editData.category,
        tags: editData.tags,
        is_global: editData.is_global
      });
    } catch (error) {
      console.error('Error saving procedure:', error);
      toast.error('Failed to save procedure changes');
    }
  };

  const handleEditCancel = () => {
    setEditData({
      title: procedure.title || '',
      description: procedure.description || '',
      category: procedure.category || 'Inspection',
      tags: procedure.tags || [],
      is_global: procedure.is_global || false,
      fields: procedure.fields || []
    });
    setIsEditing(false);
  };

  const handleEditDataChange = (updates: any) => {
    setEditData(prev => ({ ...prev, ...updates }));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const addField = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: procedure.id,
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: editData.fields.length,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, updates: Partial<ProcedureField>) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.map((field: ProcedureField, i: number) => 
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (index: number) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.filter((_: any, i: number) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...editData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];
      
      fields.forEach((field, i) => {
        field.order_index = i;
      });
      
      setEditData(prev => ({ ...prev, fields }));
    }
  };

  return {
    isEditing,
    editData,
    formData,
    newTag,
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
