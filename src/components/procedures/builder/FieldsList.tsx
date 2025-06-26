
import React, { useState } from 'react';
import { GripVertical, MoreHorizontal, Link, Paperclip, Trash2, Copy, ChevronUp, ChevronDown, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldTypeSelector } from '../FieldTypeSelector';

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
  const [expandedFields, setExpandedFields] = useState<Set<number>>(new Set());
  const [showImageUpload, setShowImageUpload] = useState<Set<number>>(new Set());

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

  const handleChoicesUpdate = (index: number, choicesText: string) => {
    const choices = choicesText.split('\n').filter(choice => choice.trim() !== '');
    const field = fields[index];
    if (onFieldUpdate) {
      onFieldUpdate(index, {
        options: {
          ...field.options,
          choices
        }
      });
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
                  ? 'border-blue-300 ring-2 ring-blue-100 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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
                  onClick={() => {
                    onFieldSelect(index);
                    toggleFieldExpansion(index);
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
                    </div>
                  </div>
                </div>

                {/* Field Controls */}
                <div className="flex items-center gap-1">
                  {/* Move Controls */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFieldMove && onFieldMove(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFieldMove && onFieldMove(index, 'down')}
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
                    onClick={() => toggleImageUpload(index)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFieldDelete && onFieldDelete(index)}
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
                      onCheckedChange={(checked) => onFieldUpdate && onFieldUpdate(index, { is_required: checked })}
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
                    <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg z-50">
                      <DropdownMenuItem onClick={() => {
                        onFieldSelect(index);
                        toggleFieldExpansion(index);
                      }}>
                        Edit Field
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFieldDuplicate && onFieldDuplicate(index)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onFieldDelete && onFieldDelete(index)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Field
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Expanded Field Editor */}
              {expandedFields.has(index) && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {/* Field Label Input */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => onFieldUpdate && onFieldUpdate(index, { label: e.target.value })}
                      className="border-0 border-b border-blue-500 rounded-none bg-transparent text-base font-medium focus-visible:ring-0 px-0 pb-1"
                      placeholder="Field label"
                    />
                  </div>

                  {/* Field Type Selector */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">Field Type</Label>
                    <FieldTypeSelector
                      value={field.field_type}
                      onChange={(value) => onFieldUpdate && onFieldUpdate(index, { field_type: value as ProcedureField['field_type'] })}
                    />
                  </div>

                  {/* Image Upload Section */}
                  {showImageUpload.has(index) && (
                    <div className="mb-4 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Field Image</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleImageUpload(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {field.options?.image ? (
                        <div className="relative">
                          <img 
                            src={field.options.image} 
                            alt="Field" 
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (onFieldUpdate) {
                                const newOptions = { ...field.options };
                                delete newOptions.image;
                                onFieldUpdate(index, { options: newOptions });
                              }
                            }}
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="w-full text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  {(field.field_type === 'select' || field.field_type === 'multiselect') && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">Options (one per line)</Label>
                      <Textarea
                        value={field.options?.choices?.join('\n') || ''}
                        onChange={(e) => handleChoicesUpdate(index, e.target.value)}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                  )}

                  {/* Help Text */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">Help Text</Label>
                    <Input
                      value={field.options?.helpText || ''}
                      onChange={(e) => onFieldUpdate && onFieldUpdate(index, { 
                        options: { 
                          ...field.options, 
                          helpText: e.target.value 
                        } 
                      })}
                      placeholder="Optional help text for users"
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Field Options Preview (when collapsed) */}
              {!expandedFields.has(index) && (field.field_type === 'select' || field.field_type === 'multiselect') && field.options?.choices && field.options.choices.length > 0 && (
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

              {/* Help Text Preview (when collapsed) */}
              {!expandedFields.has(index) && field.options?.helpText && (
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
