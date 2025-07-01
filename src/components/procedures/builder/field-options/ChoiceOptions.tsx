
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface ChoiceOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const ChoiceOptions: React.FC<ChoiceOptionsProps> = ({
  field,
  index,
  onUpdate
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

  const getOptionsLabel = () => {
    switch (field.field_type) {
      case 'select':
        return 'Dropdown Options (one per line)';
      case 'multiselect':
        return 'Checklist Options (one per line)';
      case 'radio':
        return 'Multiple Choice Options (one per line)';
      default:
        return 'Options (one per line)';
    }
  };

  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">{getOptionsLabel()}</Label>
      <Textarea
        value={field.options?.choices?.join('\n') || ''}
        onChange={(e) => handleChoicesUpdate(e.target.value)}
        placeholder="Option 1&#10;Option 2&#10;Option 3"
        rows={4}
        className="resize-none text-sm"
      />
      {field.field_type === 'multiselect' && (
        <div className="mt-2 flex items-center space-x-2">
          <Checkbox
            id={`allow-other-${index}`}
            checked={field.options?.allowOther || false}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                allowOther: Boolean(checked)
              }
            })}
          />
          <Label htmlFor={`allow-other-${index}`} className="text-sm">
            Allow "Other" option with text input
          </Label>
        </div>
      )}
    </div>
  );
};
