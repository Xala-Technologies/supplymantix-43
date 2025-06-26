
import React from 'react';
import { GripVertical } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldsListProps {
  fields: ProcedureField[];
  selectedFieldIndex: number | null;
  onFieldSelect: (index: number) => void;
  onFieldMove?: (index: number, direction: 'up' | 'down') => void;
}

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedFieldIndex,
  onFieldSelect,
  onFieldMove
}) => {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex && onFieldMove) {
      // Simple implementation - could be enhanced with proper reordering logic
      if (dragIndex < dropIndex) {
        onFieldMove(dragIndex, 'down');
      } else {
        onFieldMove(dragIndex, 'up');
      }
    }
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'checkbox': return '☑';
      case 'text': return 'T';
      case 'number': return '#';
      case 'date': return '📅';
      case 'select': return '▼';
      case 'multiselect': return '☰';
      case 'file': return '📎';
      case 'section': return '━';
      default: return '•';
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              onClick={() => onFieldSelect(index)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFieldIndex === index 
                  ? 'border-blue-300 ring-2 ring-blue-100 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-1">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                  <span className="text-lg font-mono w-6 text-center text-gray-500">
                    {getFieldTypeIcon(field.field_type)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-900 font-medium">
                      {field.label}
                    </div>
                    <div className="flex items-center gap-2">
                      {field.is_required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                        {field.field_type}
                      </span>
                    </div>
                  </div>
                  {field.field_type === 'section' && (
                    <div className="mt-2 text-sm text-gray-500">
                      Section divider
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
