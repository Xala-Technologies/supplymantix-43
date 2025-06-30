
import React from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { ProcedurePreview } from './ProcedurePreview';
import { ProcedureBuilderHeader } from './builder/ProcedureBuilderHeader';
import { ProcedureBuilderContent } from './builder/ProcedureBuilderContent';
import { useProcedureBuilderState } from './builder/useProcedureBuilderState';
import { useProcedureFieldOperations } from './builder/useProcedureFieldOperations';

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
  const {
    activeTab,
    setActiveTab,
    isPreviewMode,
    setIsPreviewMode,
    scoringEnabled,
    setScoringEnabled,
    selectedFieldIndex,
    setSelectedFieldIndex,
    formData,
    setFormData
  } = useProcedureBuilderState({ initialData });

  const {
    addField,
    addHeading,
    addSection,
    updateField,
    removeField,
    duplicateField,
    moveField,
    reorderFields
  } = useProcedureFieldOperations({
    formData,
    setFormData,
    setSelectedFieldIndex,
    selectedFieldIndex
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFormDataUpdate = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
        <ProcedureBuilderContent
          activeTab={activeTab}
          fields={formData.fields}
          selectedFieldIndex={selectedFieldIndex}
          procedureId={initialData?.id}
          formData={formData}
          onFieldSelect={setSelectedFieldIndex}
          onFieldMove={moveField}
          onFieldUpdate={updateField}
          onFieldDuplicate={duplicateField}
          onFieldDelete={removeField}
          onFieldReorder={reorderFields}
          onAddField={addField}
          onAddHeading={addHeading}
          onAddSection={addSection}
          onFormDataUpdate={handleFormDataUpdate}
        />
      </div>
    </div>
  );
};
