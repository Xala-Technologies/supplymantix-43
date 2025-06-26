import React, { useState } from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { ProcedurePreview } from './ProcedurePreview';
import { ProcedureBuilderHeader } from './builder/ProcedureBuilderHeader';
import { FieldsList } from './builder/FieldsList';
import { AddItemSidebar } from './builder/AddItemSidebar';
import { ProcedureSettings } from './builder/ProcedureSettings';

interface UnifiedProcedureBuilderProps {
  initialData?: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  };
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const UnifiedProcedureBuilder: React.FC<UnifiedProcedureBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [scoringEnabled, setScoringEnabled] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || 'New Procedure',
    description: initialData?.description || 'Procedure description',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || []
  });

  const addField = (type: ProcedureField['field_type'] = 'text') => {
    const getFieldDefaults = (fieldType: ProcedureField['field_type']) => {
      const baseDefaults = {
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        is_required: false,
        options: {}
      };

      switch (fieldType) {
        case 'select':
        case 'multiselect':
          return {
            ...baseDefaults,
            label: `New ${fieldType === 'select' ? 'Select' : 'Multi-Select'} Field`,
            options: { choices: ['Option 1', 'Option 2', 'Option 3'] }
          };
        case 'number':
        case 'amount':
          return {
            ...baseDefaults,
            options: { minValue: 0, maxValue: 100 }
          };
        case 'file':
          return {
            ...baseDefaults,
            options: { acceptedFileTypes: ['pdf', 'jpg', 'png'], maxFileSize: 10 }
          };
        case 'checkbox':
          return {
            ...baseDefaults,
            label: 'New Checkbox'
          };
        case 'date':
          return {
            ...baseDefaults,
            label: 'New Date Field'
          };
        case 'section':
          return {
            ...baseDefaults,
            label: 'Section Header',
            is_required: false
          };
        case 'divider':
          return {
            ...baseDefaults,
            label: 'Divider',
            is_required: false
          };
        default:
          return baseDefaults;
      }
    };

    const fieldDefaults = getFieldDefaults(type);
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      field_type: type,
      order_index: formData.fields.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...fieldDefaults
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldIndex(formData.fields.length);
  };

  const addHeading = () => {
    addField('section');
  };

  const addSection = () => {
    addField('divider');
  };

  const updateField = (index: number, field: Partial<ProcedureField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
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
      fields: [
        ...prev.fields.slice(0, index + 1),
        duplicatedField,
        ...prev.fields.slice(index + 1).map(field => ({
          ...field,
          order_index: field.order_index + 1
        }))
      ]
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
      
      setFormData(prev => ({ ...prev, fields }));
      
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
    
    setFormData(prev => ({ ...prev, fields }));
    
    // Update selected index if needed
    if (selectedFieldIndex === fromIndex) {
      setSelectedFieldIndex(toIndex);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (isPreviewMode) {
    return (
      <div className="h-screen bg-gray-50">
        <ProcedurePreview 
          procedure={formData} 
          scoringEnabled={scoringEnabled}
          onClose={() => setIsPreviewMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ProcedureBuilderHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scoringEnabled={scoringEnabled}
        setScoringEnabled={setScoringEnabled}
        onCancel={onCancel}
        onPreview={() => setIsPreviewMode(true)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        hasTitle={!!formData.title}
      />

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'fields' ? (
          <>
            <div className="flex-1 flex flex-col bg-gray-50">
              <FieldsList
                fields={formData.fields}
                selectedFieldIndex={selectedFieldIndex}
                onFieldSelect={setSelectedFieldIndex}
                onFieldMove={moveField}
                onFieldUpdate={updateField}
                onFieldDuplicate={duplicateField}
                onFieldDelete={removeField}
                onFieldReorder={reorderFields}
              />
            </div>

            <AddItemSidebar
              onAddField={addField}
              onAddHeading={addHeading}
              onAddSection={addSection}
            />
          </>
        ) : (
          <ProcedureSettings
            formData={formData}
            onUpdate={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            newTag={newTag}
            setNewTag={setNewTag}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        )}
      </div>
    </div>
  );
};
