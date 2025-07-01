
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface NumericOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const NumericOptions: React.FC<NumericOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  const handleNumericOptionUpdate = (key: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          [key]: numValue
        }
      });
    }
  };

  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">Numeric Constraints</Label>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Min Value</Label>
          <Input
            type="number"
            value={field.options?.minValue || ''}
            onChange={(e) => handleNumericOptionUpdate('minValue', e.target.value)}
            placeholder="Min"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Max Value</Label>
          <Input
            type="number"
            value={field.options?.maxValue || ''}
            onChange={(e) => handleNumericOptionUpdate('maxValue', e.target.value)}
            placeholder="Max"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Step</Label>
          <Input
            type="number"
            value={field.options?.step || ''}
            onChange={(e) => handleNumericOptionUpdate('step', e.target.value)}
            placeholder="1"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};
