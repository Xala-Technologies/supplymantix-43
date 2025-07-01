
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldTypeSelector } from '../FieldTypeSelector';
import { FieldOptionsRenderer } from './field-options/FieldOptionsRenderer';
import { AttachedFileSection } from './field-options/AttachedFileSection';
import { ImageUploadSection } from './field-options/ImageUploadSection';

interface FieldEditorProps {
  field: ProcedureField;
  index: number;
  showImageUpload: boolean;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onToggleImageUpload: (index: number) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  showImageUpload,
  onUpdate,
  onToggleImageUpload,
  onImageUpload
}) => {
  return (
    <div className="border-t border-gray-100 p-4 bg-gray-50">
      {/* Field Label Input */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Field Label</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdate && onUpdate(index, { label: e.target.value })}
          className="border-0 border-b border-blue-500 rounded-none bg-transparent text-base font-medium focus-visible:ring-0 px-0 pb-1"
          placeholder="Field label"
        />
      </div>

      {/* Field Type Selector */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Field Type</Label>
        <FieldTypeSelector
          value={field.field_type}
          onChange={(value) => onUpdate && onUpdate(index, { 
            field_type: value as ProcedureField['field_type'],
            options: {} // Reset options when changing field type
          })}
        />
      </div>

      {/* Field-Specific Options */}
      <FieldOptionsRenderer field={field} index={index} onUpdate={onUpdate} />

      {/* Attached File Section */}
      <AttachedFileSection field={field} index={index} onUpdate={onUpdate} />

      {/* Image Upload Section */}
      <ImageUploadSection
        field={field}
        index={index}
        showImageUpload={showImageUpload}
        onUpdate={onUpdate}
        onToggleImageUpload={onToggleImageUpload}
        onImageUpload={onImageUpload}
      />

      {/* Help Text */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Help Text</Label>
        <Input
          value={field.options?.helpText || ''}
          onChange={(e) => onUpdate && onUpdate(index, { 
            options: { 
              ...field.options, 
              helpText: e.target.value 
            } 
          })}
          placeholder="Optional help text for users"
          className="text-sm"
        />
      </div>

      {/* Required Field Toggle */}
      {!['section', 'divider', 'info'].includes(field.field_type) && (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div>
            <Label htmlFor={`required-${index}`} className="text-sm font-medium">
              Required Field
            </Label>
            <p className="text-xs text-gray-500">
              Users must complete this field
            </p>
          </div>
          <Checkbox
            id={`required-${index}`}
            checked={Boolean(field.is_required)}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, { is_required: Boolean(checked) })}
          />
        </div>
      )}
    </div>
  );
};
