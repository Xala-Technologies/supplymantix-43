
import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldWrapper } from './shared/FieldWrapper';
import { FieldLabel } from './shared/FieldLabel';

interface DateTimeFieldProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const DateField: React.FC<DateTimeFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="date"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          min={field.options?.minDate}
          max={field.options?.maxDate}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const TimeField: React.FC<DateTimeFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="time"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const DateTimeField: React.FC<DateTimeFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="datetime-local"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          min={field.options?.minDate}
          max={field.options?.maxDate}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};
