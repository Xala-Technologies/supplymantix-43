
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Link, Paperclip, Trash2, MoreHorizontal, Upload, X } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldTypeSelector } from '../FieldTypeSelector';

interface FieldEditorProps {
  field: ProcedureField;
  onUpdate: (field: Partial<ProcedureField>) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false
}) => {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        onUpdate({ 
          options: { 
            ...field.options, 
            image: imageUrl 
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChoicesUpdate = (choicesText: string) => {
    const choices = choicesText.split('\n').filter(choice => choice.trim() !== '');
    onUpdate({
      options: {
        ...field.options,
        choices
      }
    });
  };

  return (
    <div className="border rounded-lg bg-white p-4 mb-4">
      {/* Main Field Row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Drag Handle */}
        <div className="flex items-center">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
        </div>

        {/* Field Label Input */}
        <div className="flex-1">
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="border-0 border-b border-blue-500 rounded-none bg-transparent text-base font-medium focus-visible:ring-0 px-0 pb-1"
            placeholder="Field label"
          />
        </div>

        {/* Field Type Selector */}
        <div className="w-48">
          <FieldTypeSelector
            value={field.field_type}
            onChange={(value) => onUpdate({ field_type: value as ProcedureField['field_type'] })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUpload(!showImageUpload)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Required Toggle */}
          <div className="flex items-center gap-2 px-2">
            <Label htmlFor={`required-${field.id}`} className="text-sm text-gray-600">
              Required
            </Label>
            <Switch
              id={`required-${field.id}`}
              checked={field.is_required}
              onCheckedChange={(checked) => onUpdate({ is_required: checked })}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Field Image</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageUpload(false)}
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
                  const newOptions = { ...field.options };
                  delete newOptions.image;
                  onUpdate({ options: newOptions });
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
                onChange={handleImageUpload}
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
          onChange={(e) => onUpdate({ 
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
