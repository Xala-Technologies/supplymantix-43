
import React from 'react';
import { GripVertical } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldsListProps {
  fields: ProcedureField[];
  selectedFieldIndex: number | null;
  onFieldSelect: (index: number) => void;
}

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedFieldIndex,
  onFieldSelect
}) => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              onClick={() => onFieldSelect(index)}
              className={`bg-white rounded-lg border p-4 cursor-pointer transition-colors ${
                selectedFieldIndex === index 
                  ? 'border-blue-300 ring-2 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-1">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">
                    {field.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
