
import React from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldsList } from './FieldsList';
import { AddItemSidebar } from './AddItemSidebar';
import { ProcedureSettingsContent } from './ProcedureSettingsContent';

interface ProcedureBuilderContentProps {
  activeTab: string;
  fields: ProcedureField[];
  selectedFieldIndex: number | null;
  procedureId?: string;
  formData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
  };
  onFieldSelect: (index: number | null) => void;
  onFieldMove: (index: number, direction: 'up' | 'down') => void;
  onFieldUpdate: (index: number, field: Partial<ProcedureField>) => void;
  onFieldDuplicate: (index: number) => void;
  onFieldDelete: (index: number) => void;
  onFieldReorder: (fromIndex: number, toIndex: number) => void;
  onAddField: (type?: ProcedureField['field_type']) => void;
  onAddHeading: () => void;
  onAddSection: () => void;
  onFormDataUpdate: (updates: any) => void;
}

export const ProcedureBuilderContent: React.FC<ProcedureBuilderContentProps> = ({
  activeTab,
  fields,
  selectedFieldIndex,
  procedureId,
  formData,
  onFieldSelect,
  onFieldMove,
  onFieldUpdate,
  onFieldDuplicate,
  onFieldDelete,
  onFieldReorder,
  onAddField,
  onAddHeading,
  onAddSection,
  onFormDataUpdate
}) => {
  if (activeTab === 'fields') {
    return (
      <div className="flex h-full px-0">
        <div className="flex-1 flex flex-col bg-gray-50">
          <FieldsList 
            fields={fields}
            selectedFieldIndex={selectedFieldIndex}
            procedureId={procedureId}
            onFieldSelect={onFieldSelect}
            onFieldMove={onFieldMove}
            onFieldUpdate={onFieldUpdate}
            onFieldDuplicate={onFieldDuplicate}
            onFieldDelete={onFieldDelete}
            onFieldReorder={onFieldReorder}
          />
        </div>
        <AddItemSidebar 
          onAddField={onAddField}
          onAddHeading={onAddHeading}
          onAddSection={onAddSection}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <ProcedureSettingsContent 
        formData={formData}
        onUpdate={onFormDataUpdate}
      />
    </div>
  );
};
