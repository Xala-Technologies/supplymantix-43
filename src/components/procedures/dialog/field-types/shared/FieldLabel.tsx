
import React from 'react';

interface FieldLabelProps {
  field: any;
  className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ field, className = "text-sm font-semibold text-gray-900 block" }) => (
  <label className={className}>
    {field.label || field.title}
    {field.is_required && <span className="text-red-500 ml-1">*</span>}
  </label>
);
