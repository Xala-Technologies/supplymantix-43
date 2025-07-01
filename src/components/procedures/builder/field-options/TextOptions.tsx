
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface TextOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const TextOptions: React.FC<TextOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  if (field.field_type === 'info') {
    return (
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Information Content</Label>
        <Textarea
          value={field.options?.infoText || ''}
          onChange={(e) => onUpdate && onUpdate(index, {
            options: {
              ...field.options,
              infoText: e.target.value
            }
          })}
          placeholder="Enter the information text to display"
          rows={3}
          className="resize-none text-sm"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">Text Field Settings</Label>
      <div>
        <Label className="text-xs text-gray-600">Placeholder Text</Label>
        <Input
          value={field.options?.placeholder || ''}
          onChange={(e) => onUpdate && onUpdate(index, {
            options: {
              ...field.options,
              placeholder: e.target.value
            }
          })}
          placeholder="Enter placeholder text..."
          className="text-sm"
        />
      </div>
    </div>
  );
};
