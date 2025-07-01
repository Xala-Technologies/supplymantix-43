
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures/types';
import { ProcedureFieldRenderer } from './ProcedureFieldRenderer';
import { ProcedureFieldEditor } from './ProcedureFieldEditor';

interface ProcedureFieldsTabProps {
  procedure: any;
  isEditing: boolean;
  editData: any;
  formData: Record<string, any>;
  disableAutoSave?: boolean;
  onFieldChange: (fieldId: string, value: any) => void;
  onAddField: () => void;
  onUpdateField: (index: number, updates: Partial<ProcedureField>) => void;
  onMoveField: (index: number, direction: 'up' | 'down') => void;
  onRemoveField: (index: number) => void;
}

export const ProcedureFieldsTab: React.FC<ProcedureFieldsTabProps> = ({
  procedure,
  isEditing,
  editData,
  formData,
  disableAutoSave = false,
  onFieldChange,
  onAddField,
  onUpdateField,
  onMoveField,
  onRemoveField
}) => {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Procedure Fields</h3>
          <Button onClick={onAddField} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        </div>
        
        {editData.fields?.length > 0 ? (
          <div className="space-y-3">
            {editData.fields.map((field: ProcedureField, index: number) => (
              <ProcedureFieldEditor
                key={field.id}
                field={field}
                index={index}
                onUpdate={onUpdateField}
                onMove={onMoveField}
                onRemove={onRemoveField}
                totalFields={editData.fields.length}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">No Fields Yet</h3>
            <p className="text-gray-500 mb-3">Add fields to build your procedure form.</p>
            <Button onClick={onAddField} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add First Field
            </Button>
          </div>
        )}
      </div>
    );
  }

  return procedure.fields && procedure.fields.length > 0 ? (
    <div className="space-y-3">
      {procedure.fields.map((field: any, index: number) => (
        <Card key={field.id || index}>
          <CardContent className="p-3">
            <ProcedureFieldRenderer
              field={field}
              index={index}
              value={formData[field.id]}
              onChange={onFieldChange}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-8">
      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
      <h3 className="font-medium text-gray-900 mb-2">No Fields</h3>
      <p className="text-gray-500">This procedure doesn't have any fields yet.</p>
    </div>
  );
};
