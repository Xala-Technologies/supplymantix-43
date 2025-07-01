
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcedureFieldsTab } from './ProcedureFieldsTab';
import { ProcedureSettingsPanel } from './ProcedureSettingsPanel';

interface ProcedureDialogContentProps {
  procedure: any;
  isEditing: boolean;
  editData: any;
  formData: Record<string, any>;
  newTag: string;
  onFieldChange: (fieldId: string, value: any) => void;
  onEditDataChange: (updates: any) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onAddField: () => void;
  onUpdateField: (index: number, updates: any) => void;
  onMoveField: (index: number, direction: 'up' | 'down') => void;
  onRemoveField: (index: number) => void;
}

export const ProcedureDialogContent: React.FC<ProcedureDialogContentProps> = ({
  procedure,
  isEditing,
  editData,
  formData,
  newTag,
  onFieldChange,
  onEditDataChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onAddField,
  onUpdateField,
  onMoveField,
  onRemoveField
}) => {
  return (
    <Tabs defaultValue={isEditing ? "settings" : "fields"} className="flex-1 flex flex-col min-h-0">
      <TabsList className="flex-shrink-0 grid w-full grid-cols-2">
        <TabsTrigger value="fields">
          {isEditing ? 'Edit Fields' : 'Fields'}
        </TabsTrigger>
        <TabsTrigger value="settings">
          Settings
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0">
        <TabsContent value="fields" className="h-full p-4 overflow-y-auto space-y-3 mt-0">
          <ProcedureFieldsTab
            procedure={procedure}
            isEditing={isEditing}
            editData={editData}
            formData={formData}
            onFieldChange={onFieldChange}
            onAddField={onAddField}
            onUpdateField={onUpdateField}
            onMoveField={onMoveField}
            onRemoveField={onRemoveField}
          />
        </TabsContent>

        <TabsContent value="settings" className="h-full p-4 overflow-y-auto mt-0">
          <ProcedureSettingsPanel
            procedure={procedure}
            isEditing={isEditing}
            editData={editData}
            newTag={newTag}
            onEditDataChange={onEditDataChange}
            onNewTagChange={onNewTagChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
