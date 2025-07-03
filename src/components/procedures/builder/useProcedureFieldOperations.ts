
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface UseProcedureFieldOperationsProps {
  formData: {
    fields: ProcedureField[];
  };
  setFormData: (updater: (prev: any) => any) => void;
  setSelectedFieldIndex: (index: number | null) => void;
  selectedFieldIndex: number | null;
}

export const useProcedureFieldOperations = ({
  formData,
  setFormData,
  setSelectedFieldIndex,
  selectedFieldIndex
}: UseProcedureFieldOperationsProps) => {
  const addField = (type: ProcedureField['field_type'] = 'text') => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: type === 'section' ? 'New Section' : 'New Field',
      field_type: type,
      is_required: false,
      order_index: formData.fields.length,
      options: type === 'select' || type === 'multiselect' ? {
        choices: []
      } : {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldIndex(formData.fields.length);
  };

  const addHeading = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'Heading',
      field_type: 'info',
      is_required: false,
      order_index: formData.fields.length,
      options: {
        style: 'heading',
        size: 'large'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldIndex(formData.fields.length);
  };

  const addSection = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'Section',
      field_type: 'section',
      is_required: false,
      order_index: formData.fields.length,
      options: {
        collapsible: false,
        description: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldIndex(formData.fields.length);
  };

  const updateField = (index: number, field: Partial<ProcedureField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? {
        ...f,
        ...field
      } : f)
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index).map((field, i) => ({
        ...field,
        order_index: i
      }))
    }));
    setSelectedFieldIndex(null);
  };

  const duplicateField = (index: number) => {
    const fieldToDuplicate = formData.fields[index];
    const duplicatedField: ProcedureField = {
      ...fieldToDuplicate,
      id: crypto.randomUUID(),
      label: `${fieldToDuplicate.label} (Copy)`,
      order_index: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields.slice(0, index + 1), duplicatedField, ...prev.fields.slice(index + 1).map(field => ({
        ...field,
        order_index: field.order_index + 1
      }))]
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...formData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];

      // Update order indexes
      fields.forEach((field, i) => {
        field.order_index = i;
      });
      setFormData(prev => ({
        ...prev,
        fields
      }));

      // Update selected index
      if (selectedFieldIndex === index) {
        setSelectedFieldIndex(targetIndex);
      }
    }
  };

  const reorderFields = (fromIndex: number, toIndex: number) => {
    const fields = [...formData.fields];
    const [movedField] = fields.splice(fromIndex, 1);
    fields.splice(toIndex, 0, movedField);

    // Update order indexes
    fields.forEach((field, i) => {
      field.order_index = i;
    });
    setFormData(prev => ({
      ...prev,
      fields
    }));

    // Update selected index if needed
    if (selectedFieldIndex === fromIndex) {
      setSelectedFieldIndex(toIndex);
    }
  };

  return {
    addField,
    addHeading,
    addSection,
    updateField,
    removeField,
    duplicateField,
    moveField,
    reorderFields
  };
};
