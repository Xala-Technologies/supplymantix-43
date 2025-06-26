
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldInputProps {
  field: ProcedureField;
  value: any;
  onChange: (value: any) => void;
}

export const FieldInput: React.FC<FieldInputProps> = ({ field, value, onChange }) => {
  switch (field.field_type) {
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 p-3 bg-white border rounded">
          <Checkbox
            id={`field-${field.id}`}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={`field-${field.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {field.label}
          </Label>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.options?.placeholder || ''}
            className="w-full"
          />
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.choices?.map((choice, choiceIndex) => (
                <SelectItem key={choiceIndex} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="space-y-2">
            {field.options?.choices?.map((choice, choiceIndex) => (
              <div key={choiceIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field.id}-${choiceIndex}`}
                  checked={(value || []).includes(choice)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, choice]
                      : currentValues.filter((v: string) => v !== choice);
                    onChange(newValues);
                  }}
                />
                <Label htmlFor={`field-${field.id}-${choiceIndex}`} className="text-sm">
                  {choice}
                </Label>
              </div>
            ))}
          </div>
          {field.options?.helpText && (
            <p className="text-xs text-gray-500">{field.options.helpText}</p>
          )}
        </div>
      );

    case 'section':
      return (
        <div className="py-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {field.label}
          </h3>
        </div>
      );

    default:
      return null;
  }
};
