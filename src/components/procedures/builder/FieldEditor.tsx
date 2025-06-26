
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, X, Upload } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldTypeSelector } from '../FieldTypeSelector';

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
  const handleChoicesUpdate = (choicesText: string) => {
    const choices = choicesText.split('\n').filter(choice => choice.trim() !== '');
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          choices
        }
      });
    }
  };

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
          onChange={(value) => onUpdate && onUpdate(index, { field_type: value as ProcedureField['field_type'] })}
        />
      </div>

      {/* Attached File Section */}
      {field.options?.attachedFile && (
        <div className="mb-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Attached File</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onUpdate) {
                  const newOptions = { ...field.options };
                  delete newOptions.attachedFile;
                  onUpdate(index, { options: newOptions });
                }
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
            <Paperclip className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-sm">{field.options.attachedFile.name}</div>
              <div className="text-xs text-gray-500">
                {field.options.attachedFile.type} • {(field.options.attachedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
            {field.options.attachedFile.type.startsWith('image/') && (
              <img 
                src={field.options.attachedFile.url} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded border"
              />
            )}
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="mb-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Field Image</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleImageUpload(index)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          {field.options?.image ? (
            <div className="relative">
              <img 
                src={field.options.image} 
                alt="Field" 
                className="w-full h-32 object-cover rounded border"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (onUpdate) {
                    const newOptions = { ...field.options };
                    delete newOptions.image;
                    onUpdate(index, { options: newOptions });
                  }
                }}
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageUpload(index, e)}
                className="w-full text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Multiple Choice Options */}
      {(field.field_type === 'select' || field.field_type === 'multiselect') && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Options (one per line)</Label>
          <Textarea
            value={field.options?.choices?.join('\n') || ''}
            onChange={(e) => handleChoicesUpdate(e.target.value)}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            rows={3}
            className="resize-none text-sm"
          />
        </div>
      )}

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
    </div>
  );
};
