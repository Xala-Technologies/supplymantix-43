
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface DateOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const DateOptions: React.FC<DateOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">Date Settings</Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Min Date</Label>
          <Input
            type="date"
            value={field.options?.minDate || ''}
            onChange={(e) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                minDate: e.target.value
              }
            })}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Max Date</Label>
          <Input
            type="date"
            value={field.options?.maxDate || ''}
            onChange={(e) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                maxDate: e.target.value
              }
            })}
            className="text-sm"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <Checkbox
          id={`default-today-${index}`}
          checked={field.options?.defaultToday || false}
          onCheckedChange={(checked) => onUpdate && onUpdate(index, {
            options: {
              ...field.options,
              defaultToday: Boolean(checked)
            }
          })}
        />
        <Label htmlFor={`default-today-${index}`} className="text-sm">
          Default to today's date
        </Label>
      </div>
    </div>
  );
};
