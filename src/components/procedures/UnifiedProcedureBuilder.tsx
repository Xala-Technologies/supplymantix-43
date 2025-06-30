import React, { useState } from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { ProcedurePreview } from './ProcedurePreview';
import { ProcedureBuilderHeader } from './builder/ProcedureBuilderHeader';
import { FieldsList } from './builder/FieldsList';
import { AddItemSidebar } from './builder/AddItemSidebar';
import { ProcedureSettingsEnhanced } from './builder/ProcedureSettingsEnhanced';

interface UnifiedProcedureBuilderProps {
  initialData?: {
    id?: string;
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
  const [scoringEnabled, setScoringEnabled] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || 'Fire Extinguisher Inspection',
    description: initialData?.description || 'Routine fire extinguisher inspection form to ensure operability.',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || [{
      id: '1',
      procedure_id: '',
      label: 'Confirm the extinguisher is visible, unobstructed, and in its designated location.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 0,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '2',
      procedure_id: '',
      label: 'Examine the extinguisher for obvious physical damage, corrosion, leakage, or clogged nozzle.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 1,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '3',
      procedure_id: '',
      label: 'Make sure the operating instructions on the nameplate are legible and facing outward.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 2,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '4',
      procedure_id: '',
      label: 'Confirm the pressure gauge is in the operable range.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 3,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '5',
      procedure_id: '',
      label: 'Lift the fire extinguisher to ensure that it is full.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 4,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      id: '6',
      procedure_id: '',
      label: 'Verify the locking pin is intact and the tamper seal is unbroken.',
      field_type: 'checkbox' as const,
      is_required: false,
      order_index: 5,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  });

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
    addField('section');
  };

  const addSection = () => {
    addField('section');
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

      <div className="flex-1 overflow-hidden">
        {activeTab === 'fields' ? (
          <div className="flex h-full px-0">
            <div className="flex-1 flex flex-col bg-gray-50">
              <FieldsList 
                fields={formData.fields}
                selectedFieldIndex={selectedFieldIndex}
                procedureId={initialData?.id}
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
          </div>
        ) : (
          <div className="w-full h-full">
            <ProcedureSettingsEnhanced 
              formData={formData}
              onUpdate={updates => setFormData(prev => ({ ...prev, ...updates }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};
