
import React, { useState } from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { ProcedurePreview } from './ProcedurePreview';
import { ProcedureBuilderHeader } from './builder/ProcedureBuilderHeader';
import { FieldsList } from './builder/FieldsList';
import { FieldEditor } from './builder/FieldEditor';
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
    title: initialData?.title || 'Fire Extinguisher Inspection',
    description: initialData?.description || 'Routine fire extinguisher inspection form to ensure operability.',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || [
      {
        id: '1',
        procedure_id: '',
        label: 'Confirm the extinguisher is visible, unobstructed, and in its designated location.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 0,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        procedure_id: '',
        label: 'Examine the extinguisher for obvious physical damage, corrosion, leakage, or clogged nozzle.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 1,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        procedure_id: '',
        label: 'Make sure the operating instructions on the nameplate are legible and facing outward.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 2,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        procedure_id: '',
        label: 'Confirm the pressure gauge is in the operable range.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 3,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        procedure_id: '',
        label: 'Lift the fire extinguisher to ensure that it is full.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 4,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        procedure_id: '',
        label: 'Verify the locking pin is intact and the tamper seal is unbroken.',
        field_type: 'checkbox' as const,
        is_required: false,
        order_index: 5,
        options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  });

  const addField = (type: ProcedureField['field_type'] = 'text') => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'New Field',
      field_type: type,
      is_required: false,
      order_index: formData.fields.length,
      options: type === 'select' || type === 'multiselect' ? { choices: [] } : {},
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
      label: 'Section Heading',
      field_type: 'section',
      is_required: false,
      order_index: formData.fields.length,
      options: {},
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
      label: 'New Section',
      field_type: 'section',
      is_required: false,
      order_index: formData.fields.length,
      options: {},
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
              />

              {selectedFieldIndex !== null && formData.fields[selectedFieldIndex] && (
                <FieldEditor
                  field={formData.fields[selectedFieldIndex]}
                  onUpdate={(field) => updateField(selectedFieldIndex, field)}
                  onRemove={() => removeField(selectedFieldIndex)}
                />
              )}
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
