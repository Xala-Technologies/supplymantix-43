
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FieldWrapper } from './shared/FieldWrapper';
import { FieldLabel } from './shared/FieldLabel';

interface ChoiceFieldProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const CheckboxField: React.FC<ChoiceFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || false;

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
          <Checkbox
            id={field.id}
            checked={Boolean(fieldValue)}
            onCheckedChange={(checked) => onChange(field.id, Boolean(checked))}
            className="mt-0.5"
          />
          <label htmlFor={field.id} className="text-sm font-medium text-gray-900 cursor-pointer flex-1">
            {field.label || field.title}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      </div>
    </FieldWrapper>
  );
};

export const SelectField: React.FC<ChoiceFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Select value={fieldValue} onValueChange={(value) => onChange(field.id, value)}>
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.choices?.map((choice: string, choiceIndex: number) => (
              <SelectItem key={choiceIndex} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FieldWrapper>
  );
};

export const MultiSelectField: React.FC<ChoiceFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || [];

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="space-y-2 p-4 border border-gray-200 rounded-lg bg-white">
          {field.options?.choices?.map((choice: string, choiceIndex: number) => {
            const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];
            const isSelected = selectedValues.includes(choice);
            
            return (
              <div key={choiceIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`${field.id}-${choiceIndex}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
                    const newValues = checked 
                      ? [...currentValues, choice]
                      : currentValues.filter(v => v !== choice);
                    onChange(field.id, newValues);
                  }}
                />
                <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-900 cursor-pointer flex-1">
                  {choice}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </FieldWrapper>
  );
};

export const RadioField: React.FC<ChoiceFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <RadioGroup value={fieldValue} onValueChange={(value) => onChange(field.id, value)} className="space-y-3">
            {field.options?.choices?.map((choice: string, choiceIndex: number) => (
              <div key={choiceIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={choice} id={`${field.id}-${choiceIndex}`} />
                <Label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-900 cursor-pointer flex-1">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </FieldWrapper>
  );
};
