
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
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Procedure Fields</h3>
            <p className="text-sm text-gray-500 mt-1">Build your procedure form by adding and configuring fields</p>
          </div>
          <Button onClick={onAddField} size="sm" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
        
        {editData.fields?.length > 0 ? (
          <div className="space-y-4">
            {editData.fields.map((field: ProcedureField, index: number) => (
              <div key={field.id} className="animate-fade-in">
                <ProcedureFieldEditor
                  field={field}
                  index={index}
                  onUpdate={onUpdateField}
                  onMove={onMoveField}
                  onRemove={onRemoveField}
                  totalFields={editData.fields.length}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start building your procedure by adding fields. Users will fill out these fields when executing the procedure.
            </p>
            <Button onClick={onAddField} size="lg" className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Field
            </Button>
          </div>
        )}
      </div>
    );
  }

  return procedure.fields && procedure.fields.length > 0 ? (
    <div className="space-y-4">
      <div className="pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Procedure Form</h3>
        <p className="text-sm text-gray-500 mt-1">Complete the fields below to execute this procedure</p>
      </div>
      
      <div className="space-y-4">
        {procedure.fields.map((field: any, index: number) => (
          <Card key={field.id || index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
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
    </div>
  ) : (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Available</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        This procedure doesn't have any fields configured yet. Contact an administrator to add fields to this procedure.
      </p>
    </div>
  );
};
