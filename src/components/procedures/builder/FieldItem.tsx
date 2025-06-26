
import React from 'react';
import { GripVertical } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldInput } from './FieldInput';
import { FieldControls } from './FieldControls';
import { FieldPreview } from './FieldPreview';
import { FieldEditor } from './FieldEditor';

interface FieldItemProps {
  field: ProcedureField;
  index: number;
  fieldsLength: number;
  isSelected: boolean;
  isExpanded: boolean;
  showImageUpload: boolean;
  isExecutionMode?: boolean;
  fieldValue?: any;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFieldSelect: (index: number) => void;
  onFieldMove?: (index: number, direction: 'up' | 'down') => void;
  onFieldUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onFieldDuplicate?: (index: number) => void;
  onFieldDelete?: (index: number) => void;
  onFieldValueChange?: (fieldId: string, value: any) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onToggleExpansion: (index: number) => void;
  onToggleImageUpload: (index: number) => void;
  onAttachmentClick: (index: number) => void;
  onFileUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FieldItem: React.FC<FieldItemProps> = ({
  field,
  index,
  fieldsLength,
  isSelected,
  isExpanded,
  showImageUpload,
  isExecutionMode = false,
  fieldValue,
  draggedIndex,
  dragOverIndex,
  fileInputRef,
  onFieldSelect,
  onFieldMove,
  onFieldUpdate,
  onFieldDuplicate,
  onFieldDelete,
  onFieldValueChange,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onToggleExpansion,
  onToggleImageUpload,
  onAttachmentClick,
  onFileUpload,
  onImageUpload
}) => {
  const getFieldTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'checkbox': '☑',
      'text': '✓T',
      'number': '#',
      'amount': '$',
      'date': '📅',
      'select': '◉',
      'multiselect': '☰',
      'file': '📎',
      'section': '━',
      'inspection': '🔍'
    };
    return icons[type] || '•';
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'text': 'bg-green-100 text-green-600',
      'checkbox': 'bg-blue-100 text-blue-600',
      'number': 'bg-orange-100 text-orange-600',
      'amount': 'bg-pink-100 text-pink-600',
      'select': 'bg-red-100 text-red-600',
      'multiselect': 'bg-purple-100 text-purple-600',
      'inspection': 'bg-cyan-100 text-cyan-600',
      'file': 'bg-gray-100 text-gray-600',
      'section': 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const handleFieldValueChange = (value: any) => {
    if (onFieldValueChange) {
      onFieldValueChange(field.id, value);
    }
  };

  return (
    <div
      draggable={!isExecutionMode}
      onDragStart={(e) => !isExecutionMode && onDragStart(e, index)}
      onDragOver={(e) => !isExecutionMode && onDragOver(e, index)}
      onDragLeave={!isExecutionMode ? onDragLeave : undefined}
      onDrop={(e) => !isExecutionMode && onDrop(e, index)}
      onDragEnd={!isExecutionMode ? onDragEnd : undefined}
      className={`bg-white rounded-lg border transition-all duration-200 ${
        isSelected 
          ? 'border-blue-300 ring-2 ring-blue-100 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${
        draggedIndex === index ? 'opacity-50' : ''
      } ${
        dragOverIndex === index && draggedIndex !== index ? 'border-blue-400 bg-blue-50' : ''
      }`}
    >
      {/* Interactive Field Input (Execution Mode) */}
      {isExecutionMode && (
        <div className="p-4">
          <FieldInput
            field={field}
            value={fieldValue}
            onChange={handleFieldValueChange}
          />
        </div>
      )}

      {/* Main Field Row (Builder Mode) */}
      {!isExecutionMode && (
        <>
          <div className="flex items-center gap-3 p-4">
            {/* Drag Handle */}
            <div className="flex items-center">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
            </div>

            {/* Field Type Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getFieldTypeColor(field.field_type)}`}>
              {getFieldTypeIcon(field.field_type)}
            </div>

            {/* Field Content */}
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => {
                onFieldSelect(index);
                onToggleExpansion(index);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {field.label || 'Untitled Field'}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {field.field_type.replace('_', ' ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {field.is_required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                  {field.options?.attachedFile && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      Attached
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Field Controls */}
            <FieldControls
              field={field}
              index={index}
              fieldsLength={fieldsLength}
              onMove={onFieldMove}
              onUpdate={onFieldUpdate}
              onDuplicate={onFieldDuplicate}
              onDelete={onFieldDelete}
              onAttachmentClick={onAttachmentClick}
              onSelect={onFieldSelect}
              onExpand={onToggleExpansion}
            />
          </div>

          {/* Hidden file input for attachment */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.doc,.docx,.txt"
            onChange={(e) => onFileUpload(index, e)}
            className="hidden"
          />

          {/* Field Preview (when collapsed) */}
          {!isExpanded && (
            <FieldPreview
              field={field}
              index={index}
              onUpdate={onFieldUpdate}
            />
          )}

          {/* Expanded Field Editor */}
          {isExpanded && (
            <FieldEditor
              field={field}
              index={index}
              showImageUpload={showImageUpload}
              onUpdate={onFieldUpdate}
              onToggleImageUpload={onToggleImageUpload}
              onImageUpload={onImageUpload}
            />
          )}
        </>
      )}
    </div>
  );
};
