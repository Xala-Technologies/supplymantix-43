
import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { FieldWrapper } from './shared/FieldWrapper';
import { FieldLabel } from './shared/FieldLabel';

interface NumberFieldProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="number"
          value={fieldValue}
          onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
          min={field.options?.minValue}
          max={field.options?.maxValue}
          step={field.options?.step || 1}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter number..."
        />
      </div>
    </FieldWrapper>
  );
};

export const AmountField: React.FC<NumberFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="number"
            value={fieldValue}
            onChange={(e) => onChange(field.id, parseFloat(e.target.value) || 0)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            min={field.options?.minValue}
            max={field.options?.maxValue}
            step={field.options?.step || 0.01}
            placeholder="0.00"
          />
        </div>
      </div>
    </FieldWrapper>
  );
};

export const SliderField: React.FC<NumberFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || 0;

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="px-4 py-6 bg-gray-50 rounded-lg border border-gray-200">
          <Slider
            value={[fieldValue || field.options?.minValue || 0]}
            onValueChange={(values) => onChange(field.id, values[0])}
            min={field.options?.minValue || 0}
            max={field.options?.maxValue || 100}
            step={field.options?.step || 1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>{field.options?.minValue || 0}</span>
            <Badge variant="secondary" className="font-medium">
              {fieldValue || field.options?.minValue || 0}
            </Badge>
            <span>{field.options?.maxValue || 100}</span>
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
};
