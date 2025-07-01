
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paperclip, X, Upload } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { FieldTypeSelector } from '../FieldTypeSelector';

interface FieldEditorProps {
  field: ProcedureField;
  index: number;
  showImageUpload: boolean;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onToggleImageUpload: (index: number) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  showImageUpload,
  onUpdate,
  onToggleImageUpload,
  onImageUpload
}) => {
  const handleChoicesUpdate = (choicesText: string) => {
    const choices = choicesText.split('\n').filter(choice => choice.trim() !== '');
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          choices
        }
      });
    }
  };

  const handleNumericOptionUpdate = (key: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (onUpdate) {
      onUpdate(index, {
        options: {
          ...field.options,
          [key]: numValue
        }
      });
    }
  };

  const renderFieldSpecificOptions = () => {
    switch (field.field_type) {
      case 'inspection':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Inspection Options</Label>
            <div className="p-4 bg-white rounded-lg border space-y-3">
              <div className="text-sm text-gray-600 mb-3">
                Users will be able to select: Pass, Fail, or Flag
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`allow-comments-${index}`}
                  checked={field.options?.allowComments || false}
                  onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      allowComments: Boolean(checked)
                    }
                  })}
                />
                <Label htmlFor={`allow-comments-${index}`} className="text-sm">
                  Allow comments for failed or flagged items
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`require-comment-fail-${index}`}
                  checked={field.options?.requireCommentOnFail || false}
                  onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      requireCommentOnFail: Boolean(checked)
                    }
                  })}
                />
                <Label htmlFor={`require-comment-fail-${index}`} className="text-sm">
                  Require comment when marked as Failed
                </Label>
              </div>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Dropdown Options (one per line)</Label>
            <Textarea
              value={field.options?.choices?.join('\n') || ''}
              onChange={(e) => handleChoicesUpdate(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
              className="resize-none text-sm"
            />
          </div>
        );

      case 'multiselect':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Checklist Options (one per line)</Label>
            <Textarea
              value={field.options?.choices?.join('\n') || ''}
              onChange={(e) => handleChoicesUpdate(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
              className="resize-none text-sm"
            />
            <div className="mt-2 flex items-center space-x-2">
              <Checkbox
                id={`allow-other-${index}`}
                checked={field.options?.allowOther || false}
                onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                  options: {
                    ...field.options,
                    allowOther: Boolean(checked)
                  }
                })}
              />
              <Label htmlFor={`allow-other-${index}`} className="text-sm">
                Allow "Other" option with text input
              </Label>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Multiple Choice Options (one per line)</Label>
            <Textarea
              value={field.options?.choices?.join('\n') || ''}
              onChange={(e) => handleChoicesUpdate(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
              className="resize-none text-sm"
            />
          </div>
        );

      case 'number':
      case 'slider':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Numeric Constraints</Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Min Value</Label>
                <Input
                  type="number"
                  value={field.options?.minValue || ''}
                  onChange={(e) => handleNumericOptionUpdate('minValue', e.target.value)}
                  placeholder="Min"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Max Value</Label>
                <Input
                  type="number"
                  value={field.options?.maxValue || ''}
                  onChange={(e) => handleNumericOptionUpdate('maxValue', e.target.value)}
                  placeholder="Max"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Step</Label>
                <Input
                  type="number"
                  value={field.options?.step || ''}
                  onChange={(e) => handleNumericOptionUpdate('step', e.target.value)}
                  placeholder="1"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Rating Configuration</Label>
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-xs text-gray-600">Max Stars</Label>
                <Select
                  value={String(field.options?.maxRating || 5)}
                  onValueChange={(value) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      maxRating: parseInt(value)
                    }
                  })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`allow-half-stars-${index}`}
                  checked={field.options?.allowHalfStars || false}
                  onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      allowHalfStars: Boolean(checked)
                    }
                  })}
                />
                <Label htmlFor={`allow-half-stars-${index}`} className="text-sm">
                  Allow half stars
                </Label>
              </div>
            </div>
          </div>
        );

      case 'file':
      case 'image':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">File Upload Settings</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`multiple-files-${index}`}
                  checked={field.options?.allowMultipleFiles || false}
                  onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      allowMultipleFiles: Boolean(checked)
                    }
                  })}
                />
                <Label htmlFor={`multiple-files-${index}`} className="text-sm">
                  Allow multiple files
                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <Label className="text-xs text-gray-600">Max file size (MB)</Label>
                  <Input
                    type="number"
                    value={field.options?.maxFileSize ? field.options.maxFileSize / (1024 * 1024) : '10'}
                    onChange={(e) => {
                      const sizeInBytes = parseFloat(e.target.value) * 1024 * 1024;
                      onUpdate && onUpdate(index, {
                        options: {
                          ...field.options,
                          maxFileSize: sizeInBytes
                        }
                      });
                    }}
                    className="w-24 text-sm"
                  />
                </div>
                {field.field_type === 'file' && (
                  <div>
                    <Label className="text-xs text-gray-600">Allowed types</Label>
                    <Input
                      value={field.options?.allowedTypes || ''}
                      onChange={(e) => onUpdate && onUpdate(index, {
                        options: {
                          ...field.options,
                          allowedTypes: e.target.value
                        }
                      })}
                      placeholder=".pdf,.doc,.docx"
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'date':
      case 'datetime':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Date Settings</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Min Date</Label>
                <Input
                  type="date"
                  value={field.options?.minDate || ''}
                  onChange={(e) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      minDate: e.target.value
                    }
                  })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Max Date</Label>
                <Input
                  type="date"
                  value={field.options?.maxDate || ''}
                  onChange={(e) => onUpdate && onUpdate(index, {
                    options: {
                      ...field.options,
                      maxDate: e.target.value
                    }
                  })}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Checkbox
                id={`default-today-${index}`}
                checked={field.options?.defaultToday || false}
                onCheckedChange={(checked) => onUpdate && onUpdate(index, {
                  options: {
                    ...field.options,
                    defaultToday: Boolean(checked)
                  }
                })}
              />
              <Label htmlFor={`default-today-${index}`} className="text-sm">
                Default to today's date
              </Label>
            </div>
          </div>
        );

      case 'info':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Information Content</Label>
            <Textarea
              value={field.options?.infoText || ''}
              onChange={(e) => onUpdate && onUpdate(index, {
                options: {
                  ...field.options,
                  infoText: e.target.value
                }
              })}
              placeholder="Enter the information text to display"
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        );

      case 'text':
      case 'textarea':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Text Field Settings</Label>
            <div>
              <Label className="text-xs text-gray-600">Placeholder Text</Label>
              <Input
                value={field.options?.placeholder || ''}
                onChange={(e) => onUpdate && onUpdate(index, {
                  options: {
                    ...field.options,
                    placeholder: e.target.value
                  }
                })}
                placeholder="Enter placeholder text..."
                className="text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-gray-50">
      {/* Field Label Input */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Field Label</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdate && onUpdate(index, { label: e.target.value })}
          className="border-0 border-b border-blue-500 rounded-none bg-transparent text-base font-medium focus-visible:ring-0 px-0 pb-1"
          placeholder="Field label"
        />
      </div>

      {/* Field Type Selector */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Field Type</Label>
        <FieldTypeSelector
          value={field.field_type}
          onChange={(value) => onUpdate && onUpdate(index, { 
            field_type: value as ProcedureField['field_type'],
            options: {} // Reset options when changing field type
          })}
        />
      </div>

      {/* Field-Specific Options */}
      {renderFieldSpecificOptions()}

      {/* Attached File Section */}
      {field.options?.attachedFile && (
        <div className="mb-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Attached File</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onUpdate) {
                  const newOptions = { ...field.options };
                  delete newOptions.attachedFile;
                  onUpdate(index, { options: newOptions });
                }
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
            <Paperclip className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-sm">{field.options.attachedFile.name}</div>
              <div className="text-xs text-gray-500">
                {field.options.attachedFile.type} • {(field.options.attachedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
            {field.options.attachedFile.type.startsWith('image/') && (
              <img 
                src={field.options.attachedFile.url} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded border"
              />
            )}
          </div>
        </div>
      )}

      {/* Image Upload Section */}
      {showImageUpload && (
        <div className="mb-4 p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Field Image</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleImageUpload(index)}
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
                  if (onUpdate) {
                    const newOptions = { ...field.options };
                    delete newOptions.image;
                    onUpdate(index, { options: newOptions });
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
                onChange={(e) => onImageUpload(index, e)}
                className="w-full text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Help Text</Label>
        <Input
          value={field.options?.helpText || ''}
          onChange={(e) => onUpdate && onUpdate(index, { 
            options: { 
              ...field.options, 
              helpText: e.target.value 
            } 
          })}
          placeholder="Optional help text for users"
          className="text-sm"
        />
      </div>

      {/* Required Field Toggle */}
      {!['section', 'divider', 'info'].includes(field.field_type) && (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
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
            onCheckedChange={(checked) => onUpdate && onUpdate(index, { is_required: Boolean(checked) })}
          />
        </div>
      )}
    </div>
  );
};
