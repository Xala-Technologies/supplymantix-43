
import React, { useState, useRef } from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldItem } from './FieldItem';

interface FieldsListProps {
  fields: ProcedureField[];
  selectedFieldIndex: number | null;
  onFieldSelect: (index: number) => void;
  onFieldMove?: (index: number, direction: 'up' | 'down') => void;
  onFieldUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onFieldDuplicate?: (index: number) => void;
  onFieldDelete?: (index: number) => void;
  onFieldReorder?: (fromIndex: number, toIndex: number) => void;
  isExecutionMode?: boolean;
  fieldValues?: Record<string, any>;
  onFieldValueChange?: (fieldId: string, value: any) => void;
}

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedFieldIndex,
  onFieldSelect,
  onFieldMove,
  onFieldUpdate,
  onFieldDuplicate,
  onFieldDelete,
  onFieldReorder,
  isExecutionMode = false,
  fieldValues = {},
  onFieldValueChange
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedFields, setExpandedFields] = useState<Set<number>>(new Set());
  const [showImageUpload, setShowImageUpload] = useState<Set<number>>(new Set());
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex && onFieldReorder) {
      onFieldReorder(dragIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const toggleFieldExpansion = (index: number) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFields(newExpanded);
  };

  const toggleImageUpload = (index: number) => {
    const newSet = new Set(showImageUpload);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setShowImageUpload(newSet);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFieldUpdate) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = reader.result as string;
        const field = fields[index];
        onFieldUpdate(index, { 
          options: { 
            ...field.options, 
            attachedFile: {
              name: file.name,
              url: fileUrl,
              type: file.type,
              size: file.size
            }
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentClick = (index: number) => {
    const input = fileInputRefs.current[index];
    if (input) {
      input.click();
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFieldUpdate) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        const field = fields[index];
        onFieldUpdate(index, { 
          options: { 
            ...field.options, 
            image: imageUrl 
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-300">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields yet</h3>
          <p className="text-gray-500 mb-4">Start building your procedure by adding fields from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <FieldItem
              key={field.id}
              field={field}
              index={index}
              fieldsLength={fields.length}
              isSelected={selectedFieldIndex === index}
              isExpanded={expandedFields.has(index)}
              showImageUpload={showImageUpload.has(index)}
              isExecutionMode={isExecutionMode}
              fieldValue={fieldValues[field.id]}
              draggedIndex={draggedIndex}
              dragOverIndex={dragOverIndex}
              fileInputRef={{ current: fileInputRefs.current[index] || null }}
              onFieldSelect={onFieldSelect}
              onFieldMove={onFieldMove}
              onFieldUpdate={onFieldUpdate}
              onFieldDuplicate={onFieldDuplicate}
              onFieldDelete={onFieldDelete}
              onFieldValueChange={onFieldValueChange}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onToggleExpansion={toggleFieldExpansion}
              onToggleImageUpload={toggleImageUpload}
              onAttachmentClick={handleAttachmentClick}
              onFileUpload={handleFileUpload}
              onImageUpload={handleImageUpload}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
