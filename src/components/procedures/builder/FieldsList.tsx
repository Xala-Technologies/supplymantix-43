
import React, { useState } from 'react';
import { GripVertical, MoreHorizontal, Link, Paperclip, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldsListProps {
  fields: ProcedureField[];
  selectedFieldIndex: number | null;
  onFieldSelect: (index: number) => void;
  onFieldMove?: (index: number, direction: 'up' | 'down') => void;
  onFieldUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onFieldDuplicate?: (index: number) => void;
  onFieldDelete?: (index: number) => void;
  onFieldReorder?: (fromIndex: number, toIndex: number) => void;
}

export const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  selectedFieldIndex,
  onFieldSelect,
  onFieldMove,
  onFieldUpdate,
  onFieldDuplicate,
  onFieldDelete,
  onFieldReorder
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const getFieldTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'checkbox': '☑',
      'text': 'T',
      'number': '#',
      'amount': '$',
      'date': '📅',
      'select': '▼',
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

  const handleRequiredToggle = (index: number, checked: boolean) => {
    if (onFieldUpdate) {
      onFieldUpdate(index, { is_required: checked });
    }
  };

  const handleFieldMove = (index: number, direction: 'up' | 'down') => {
    if (onFieldMove) {
      onFieldMove(index, direction);
    }
  };

  const handleFieldDuplicate = (index: number) => {
    if (onFieldDuplicate) {
      onFieldDuplicate(index);
    }
  };

  const handleFieldDelete = (index: number) => {
    if (onFieldDelete) {
      onFieldDelete(index);
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
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-lg border transition-all duration-200 ${
                selectedFieldIndex === index 
                  ? 'border-blue-300 ring-2 ring-blue-100 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              } ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index ? 'border-blue-400 bg-blue-50' : ''
              }`}
            >
              {/* Main Field Row */}
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
                  onClick={() => onFieldSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {field.label || 'Untitled Field'}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {field.field_type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {field.is_required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Field Controls */}
                <div className="flex items-center gap-1">
                  {/* Move Controls */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldMove(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldMove(index, 'down')}
                    disabled={index === fields.length - 1}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Link Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  
                  {/* Attachment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldDelete(index)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Required Toggle */}
                  <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                    <Label htmlFor={`required-${field.id}`} className="text-sm text-gray-600">
                      Required
                    </Label>
                    <Switch
                      id={`required-${field.id}`}
                      checked={field.is_required}
                      onCheckedChange={(checked) => handleRequiredToggle(index, checked)}
                      size="sm"
                    />
                  </div>

                  {/* More Options Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onFieldSelect(index)}>
                        Edit Field
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFieldDuplicate(index)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleFieldDelete(index)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Field
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Field Options Preview */}
              {(field.field_type === 'select' || field.field_type === 'multiselect') && field.options?.choices && field.options.choices.length > 0 && (
                <div className="px-4 pb-4 pt-0">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">Options:</div>
                    <div className="flex flex-wrap gap-1">
                      {field.options.choices.slice(0, 3).map((choice, choiceIndex) => (
                        <span key={choiceIndex} className="text-xs bg-white px-2 py-1 rounded border">
                          {choice}
                        </span>
                      ))}
                      {field.options.choices.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{field.options.choices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text Preview */}
              {field.options?.helpText && (
                <div className="px-4 pb-4 pt-0">
                  <div className="text-xs text-gray-500 italic">
                    Help: {field.options.helpText}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
