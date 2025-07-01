
import React from 'react';
import { TextField, TextAreaField, EmailField, PhoneField, UrlField } from './field-types/TextFields';
import { NumberField, AmountField, SliderField } from './field-types/NumberFields';
import { CheckboxField, SelectField, MultiSelectField, RadioField } from './field-types/ChoiceFields';
import { DateField, TimeField, DateTimeField } from './field-types/DateTimeFields';
import { RatingField, FileField, InspectionField, SectionField, DividerField, InfoField, DefaultField } from './field-types/SpecialFields';

interface ProcedureFieldRendererProps {
  field: any;
  index: number;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const ProcedureFieldRenderer: React.FC<ProcedureFieldRendererProps> = ({
  field,
  index,
  value,
  onChange
}) => {
  const fieldProps = { field, index, value, onChange };

  switch (field.field_type || field.type) {
    case 'text':
      return <TextField {...fieldProps} />;
    case 'textarea':
      return <TextAreaField {...fieldProps} />;
    case 'email':
      return <EmailField {...fieldProps} />;
    case 'phone':
      return <PhoneField {...fieldProps} />;
    case 'url':
      return <UrlField {...fieldProps} />;
    case 'number':
      return <NumberField {...fieldProps} />;
    case 'amount':
      return <AmountField {...fieldProps} />;
    case 'slider':
      return <SliderField {...fieldProps} />;
    case 'checkbox':
      return <CheckboxField {...fieldProps} />;
    case 'select':
      return <SelectField {...fieldProps} />;
    case 'multiselect':
      return <MultiSelectField {...fieldProps} />;
    case 'radio':
      return <RadioField {...fieldProps} />;
    case 'date':
      return <DateField {...fieldProps} />;
    case 'time':
      return <TimeField {...fieldProps} />;
    case 'datetime':
      return <DateTimeField {...fieldProps} />;
    case 'rating':
      return <RatingField {...fieldProps} />;
    case 'file':
    case 'image':
      return <FileField {...fieldProps} />;
    case 'inspection':
      return <InspectionField {...fieldProps} />;
    case 'section':
      return <SectionField {...fieldProps} />;
    case 'divider':
      return <DividerField {...fieldProps} />;
    case 'info':
      return <InfoField {...fieldProps} />;
    default:
      return <DefaultField {...fieldProps} />;
  }
};
