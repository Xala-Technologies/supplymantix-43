
import React from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { InspectionOptions } from './InspectionOptions';
import { ChoiceOptions } from './ChoiceOptions';
import { NumericOptions } from './NumericOptions';
import { RatingOptions } from './RatingOptions';
import { FileOptions } from './FileOptions';
import { DateOptions } from './DateOptions';
import { TextOptions } from './TextOptions';

interface FieldOptionsRendererProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const FieldOptionsRenderer: React.FC<FieldOptionsRendererProps> = ({
  field,
  index,
  onUpdate
}) => {
  switch (field.field_type) {
    case 'inspection':
      return <InspectionOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'select':
    case 'multiselect':
    case 'radio':
      return <ChoiceOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'number':
    case 'slider':
      return <NumericOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'rating':
      return <RatingOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'file':
    case 'image':
      return <FileOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'date':
    case 'datetime':
      return <DateOptions field={field} index={index} onUpdate={onUpdate} />;

    case 'info':
    case 'text':
    case 'textarea':
    case 'email':
    case 'phone':
    case 'url':
      return <TextOptions field={field} index={index} onUpdate={onUpdate} />;

    default:
      return null;
  }
};
