
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
  disableAutoSave?: boolean;
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
  disableAutoSave = false,
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
    <div className="h-full flex flex-col">
      <Tabs defaultValue={isEditing ? "settings" : "fields"} className="h-full flex flex-col">
        <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <TabsList className="grid w-full max-w-sm grid-cols-2 h-9">
            <TabsTrigger value="fields" className="text-sm">
              {isEditing ? 'Edit Fields' : 'Fields'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="fields" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-6">
              <ProcedureFieldsTab
                procedure={procedure}
                isEditing={isEditing}
                editData={editData}
                formData={formData}
                disableAutoSave={disableAutoSave}
                onFieldChange={onFieldChange}
                onAddField={onAddField}
                onUpdateField={onUpdateField}
                onMoveField={onMoveField}
                onRemoveField={onRemoveField}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-6">
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
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
