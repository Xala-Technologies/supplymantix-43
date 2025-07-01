
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2, Plus, X } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures/types';

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', description: 'Single line text input' },
  { value: 'textarea', label: 'Long Text', description: 'Multi-line text area' },
  { value: 'number', label: 'Number', description: 'Numeric input with validation' },
  { value: 'email', label: 'Email', description: 'Email address with validation' },
  { value: 'phone', label: 'Phone', description: 'Phone number input' },
  { value: 'url', label: 'URL', description: 'Website URL input' },
  { value: 'date', label: 'Date', description: 'Date picker' },
  { value: 'time', label: 'Time', description: 'Time picker' },
  { value: 'datetime', label: 'Date & Time', description: 'Combined date and time picker' },
  { value: 'checkbox', label: 'Checkbox', description: 'Single yes/no checkbox' },
  { value: 'select', label: 'Dropdown (Single)', description: 'Select one option from dropdown' },
  { value: 'multiselect', label: 'Dropdown (Multiple)', description: 'Select multiple options from dropdown' },
  { value: 'radio', label: 'Radio Buttons', description: 'Select one option from radio buttons' },
  { value: 'rating', label: 'Rating', description: 'Star rating system' },
  { value: 'slider', label: 'Slider', description: 'Numeric slider with range' },
  { value: 'file', label: 'File Upload', description: 'File upload field' },
  { value: 'image', label: 'Image Upload', description: 'Image upload with preview' },
  { value: 'inspection', label: 'Inspection', description: 'Pass/Fail/N/A inspection field' },
  { value: 'section', label: 'Section Header', description: 'Visual section divider with title' },
  { value: 'info', label: 'Information', description: 'Display-only information text' },
  { value: 'divider', label: 'Divider', description: 'Visual separator line' }
];

interface ProcedureFieldEditorProps {
  field: ProcedureField;
  index: number;
  onUpdate: (index: number, updates: Partial<ProcedureField>) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onRemove: (index: number) => void;
  totalFields: number;
}

export const ProcedureFieldEditor: React.FC<ProcedureFieldEditorProps> = ({
  field,
  index,
  onUpdate,
  onMove,
  onRemove,
  totalFields
}) => {
  const fieldType = FIELD_TYPES.find(type => type.value === field.field_type);
  const hasChoices = ['select', 'multiselect', 'radio'].includes(field.field_type);
  const choices = field.options?.choices || [];

  const addChoice = () => {
    const newChoices = [...choices, ''];
    onUpdate(index, {
      options: { 
        ...field.options, 
        choices: newChoices 
      }
    });
  };

  const updateChoice = (choiceIndex: number, value: string) => {
    const newChoices = [...choices];
    newChoices[choiceIndex] = value;
    onUpdate(index, {
      options: { 
        ...field.options, 
        choices: newChoices.filter(choice => choice.trim() !== '')
      }
    });
  };

  const removeChoice = (choiceIndex: number) => {
    const newChoices = choices.filter((_, i) => i !== choiceIndex);
    onUpdate(index, {
      options: { 
        ...field.options, 
        choices: newChoices 
      }
    });
  };

  const updateNumericOption = (key: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onUpdate(index, {
      options: {
        ...field.options,
        [key]: numValue
      }
    });
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 pt-1">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <Badge variant="outline" className="text-xs px-2 py-0">
              {index + 1}
            </Badge>
          </div>

          <div className="flex-1 space-y-4">
            {/* Field Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {fieldType?.label || field.field_type}
                  </Badge>
                  {field.is_required && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                </div>
                {fieldType?.description && (
                  <p className="text-xs text-gray-500">{fieldType.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(index, 'down')}
                  disabled={index === totalFields - 1}
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Basic Field Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Field Label *</Label>
                <Input
                  value={field.label}
                  onChange={(e) => onUpdate(index, { label: e.target.value })}
                  placeholder="Enter field label"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Field Type</Label>
                <Select 
                  value={field.field_type} 
                  onValueChange={(value) => onUpdate(index, { 
                    field_type: value,
                    options: {} // Reset options when changing field type
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Help Text */}
            <div>
              <Label className="text-sm font-medium">Help Text</Label>
              <Input
                value={field.options?.helpText || ''}
                onChange={(e) => onUpdate(index, {
                  options: { 
                    ...field.options, 
                    helpText: e.target.value 
                  }
                })}
                placeholder="Optional help text for users"
                className="mt-1"
              />
            </div>

            {/* Multiple Choice Options */}
            {hasChoices && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChoice}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {choices.map((choice: string, choiceIndex: number) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <Input
                        value={choice}
                        onChange={(e) => updateChoice(choiceIndex, e.target.value)}
                        placeholder={`Option ${choiceIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChoice(choiceIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {choices.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded">
                      Click "Add Option" to create choices for this field
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Numeric Field Options */}
            {['number', 'slider'].includes(field.field_type) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Minimum Value</Label>
                  <Input
                    type="number"
                    value={field.options?.minValue || ''}
                    onChange={(e) => updateNumericOption('minValue', e.target.value)}
                    placeholder="Min"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Maximum Value</Label>
                  <Input
                    type="number"
                    value={field.options?.maxValue || ''}
                    onChange={(e) => updateNumericOption('maxValue', e.target.value)}
                    placeholder="Max"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Step</Label>
                  <Input
                    type="number"
                    value={field.options?.step || ''}
                    onChange={(e) => updateNumericOption('step', e.target.value)}
                    placeholder="Step"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Rating Field Options */}
            {field.field_type === 'rating' && (
              <div>
                <Label className="text-sm font-medium">Maximum Rating</Label>
                <Select
                  value={String(field.options?.maxRating || 5)}
                  onValueChange={(value) => onUpdate(index, {
                    options: {
                      ...field.options,
                      maxRating: parseInt(value)
                    }
                  })}
                >
                  <SelectTrigger className="mt-1 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={String(num)}>
                        {num} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* File Upload Options */}
            {['file', 'image'].includes(field.field_type) && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`multiple-${index}`}
                    checked={field.options?.allowMultipleFiles || false}
                    onCheckedChange={(checked) => onUpdate(index, {
                      options: {
                        ...field.options,
                        allowMultipleFiles: Boolean(checked)
                      }
                    })}
                  />
                  <Label htmlFor={`multiple-${index}`} className="text-sm">Allow multiple files</Label>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Max file size (MB)</Label>
                  <Input
                    type="number"
                    value={field.options?.maxFileSize ? field.options.maxFileSize / (1024 * 1024) : '10'}
                    onChange={(e) => {
                      const sizeInBytes = parseFloat(e.target.value) * 1024 * 1024;
                      onUpdate(index, {
                        options: {
                          ...field.options,
                          maxFileSize: sizeInBytes
                        }
                      });
                    }}
                    className="mt-1 w-32"
                  />
                </div>
              </div>
            )}

            {/* Information Field Options */}
            {field.field_type === 'info' && (
              <div>
                <Label className="text-sm font-medium">Information Text</Label>
                <Textarea
                  value={field.options?.infoText || ''}
                  onChange={(e) => onUpdate(index, {
                    options: {
                      ...field.options,
                      infoText: e.target.value
                    }
                  })}
                  placeholder="Enter the information text to display"
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {/* Required Toggle */}
            {!['section', 'divider', 'info'].includes(field.field_type) && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor={`required-${index}`} className="text-sm font-medium">
                    Required Field
                  </Label>
                  <p className="text-xs text-gray-500">
                    Users must complete this field
                  </p>
                </div>
                <Checkbox
                  id={`required-${index}`}
                  checked={Boolean(field.is_required)}
                  onCheckedChange={(checked) => onUpdate(index, { is_required: Boolean(checked) })}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
