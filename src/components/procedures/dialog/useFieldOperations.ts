
import { useCallback } from 'react';
import { ProcedureField } from '@/lib/database/procedures/types';

export const useFieldOperations = (
  editData: any,
  setEditData: (updater: (prev: any) => any) => void,
  procedureId: string
) => {
  const addField = useCallback(() => {
    const fieldsLength = editData?.fields?.length ?? 0;
    
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: fieldsLength,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Adding new field:', newField);
    setEditData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  }, [editData?.fields, setEditData]);

  const updateField = useCallback((index: number, updates: Partial<ProcedureField>) => {
    console.log('Updating field at index:', index, updates);
    setEditData(prev => ({
      ...prev,
      fields: (prev.fields || []).map((field: ProcedureField, i: number) => 
        i === index ? { ...field, ...updates, updated_at: new Date().toISOString() } : field
      )
    }));
  }, [setEditData]);

  const removeField = useCallback((index: number) => {
    console.log('Removing field at index:', index);
    setEditData(prev => ({
      ...prev,
      fields: (prev.fields || []).filter((_: any, i: number) => i !== index).map((field: ProcedureField, i: number) => ({
        ...field,
        order_index: i
      }))
    }));
  }, [setEditData]);

  const moveField = useCallback((index: number, direction: 'up' | 'down') => {
    const fields = [...(editData?.fields || [])];
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
  }, [editData?.fields, setEditData]);

  return {
    addField,
    updateField,
    removeField,
    moveField
  };
};
