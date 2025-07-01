
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface RequiredToggleProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const RequiredToggle: React.FC<RequiredToggleProps> = ({
  field,
  index,
  onUpdate
}) => {
  const handleRequiredToggle = (checked: boolean) => {
    console.log('Required toggle changed for field index:', index, 'to:', checked);
    if (onUpdate) {
      onUpdate(index, { is_required: checked });
    } else {
      console.warn('onUpdate handler not provided');
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 border-l border-gray-200">
      <Label htmlFor={`required-${field.id}`} className="text-sm text-gray-600">
        Required
      </Label>
      <Switch
        id={`required-${field.id}`}
        checked={field.is_required}
        onCheckedChange={handleRequiredToggle}
      />
    </div>
  );
};
