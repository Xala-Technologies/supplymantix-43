
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
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
  const [newChoice, setNewChoice] = useState('');
  const choices = field.options?.choices || [];

  const addChoice = () => {
    if (!newChoice.trim()) return;
    
    const updatedChoices = [...choices, newChoice.trim()];
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          choices: updatedChoices
        }
      });
    }
    setNewChoice('');
  };

  const removeChoice = (choiceIndex: number) => {
    const updatedChoices = choices.filter((_, i) => i !== choiceIndex);
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          choices: updatedChoices
        }
      });
    }
  };

  const getOptionsLabel = () => {
    switch (field.field_type) {
      case 'select':
        return 'Dropdown Options';
      case 'multiselect':
        return 'Checklist Options';
      case 'radio':
        return 'Multiple Choice Options';
      default:
        return 'Options';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">{getOptionsLabel()}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChoice}
          disabled={!newChoice.trim()}
          className="h-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Option
        </Button>
      </div>
      
      <div className="space-y-2">
        {choices.map((choice: string, choiceIndex: number) => (
          <div key={choiceIndex} className="flex items-center gap-2 p-3 border rounded-lg bg-white">
            <Input
              value={choice}
              readOnly
              className="flex-1 border-none bg-transparent p-0 focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeChoice(choiceIndex)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <Input
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
            placeholder="Add new option"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addChoice()}
          />
        </div>
        
        {choices.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded">
            Click "Add Option" to create choices for this field
          </p>
        )}
      </div>

      {field.field_type === 'multiselect' && (
        <div className="mt-3 flex items-center space-x-2">
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
