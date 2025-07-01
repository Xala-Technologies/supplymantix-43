
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign } from 'lucide-react';
import { FieldWrapper } from './shared/FieldWrapper';
import { FieldLabel } from './shared/FieldLabel';

interface TextFieldProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.options?.placeholder || 'Enter text...'}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const TextAreaField: React.FC<TextFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Textarea
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.options?.placeholder || 'Enter detailed text...'}
          className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const EmailField: React.FC<TextFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="email"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.options?.placeholder || 'Enter email address'}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const PhoneField: React.FC<TextFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="tel"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.options?.placeholder || 'Enter phone number'}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};

export const UrlField: React.FC<TextFieldProps> = ({ field, index, value, onChange }) => {
  const fieldValue = value || field.options?.defaultValue || '';

  return (
    <FieldWrapper field={field} index={index}>
      <div key={field.id || index} className="space-y-3">
        <FieldLabel field={field} />
        <Input
          type="url"
          value={fieldValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.options?.placeholder || 'https://example.com'}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </FieldWrapper>
  );
};
