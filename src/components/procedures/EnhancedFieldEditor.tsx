
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical, ChevronUp, ChevronDown, Link, Paperclip, Star, Copy, Eye, EyeOff, AlertCircle, Check, Plus, X } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";
import { toast } from "sonner";

interface EnhancedFieldEditorProps {
  field: ProcedureField;
  index: number;
  totalFields: number;
  scoringEnabled: boolean;
  onUpdate: (field: Partial<ProcedureField>) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text Field', icon: '📝', description: 'Single line text input' },
  { value: 'textarea', label: 'Long Text', icon: '📄', description: 'Multi-line text area' },
  { value: 'number', label: 'Number Field', icon: '#️⃣', description: 'Numeric input with validation' },
  { value: 'email', label: 'Email Field', icon: '📧', description: 'Email address input' },
  { value: 'url', label: 'URL Field', icon: '🔗', description: 'Website URL input' },
  { value: 'phone', label: 'Phone Field', icon: '📞', description: 'Phone number input' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Single checkbox option' },
  { value: 'select', label: 'Multiple Choice', icon: '🔘', description: 'Single selection dropdown' },
  { value: 'multiselect', label: 'Checklist', icon: '✅', description: 'Multiple selection options' },
  { value: 'radio', label: 'Radio Buttons', icon: '⚪', description: 'Single choice from options' },
  { value: 'date', label: 'Date', icon: '📅', description: 'Date picker input' },
  { value: 'time', label: 'Time', icon: '⏰', description: 'Time picker input' },
  { value: 'datetime', label: 'Date & Time', icon: '📅⏰', description: 'Date and time picker' },
  { value: 'file', label: 'File Upload', icon: '📁', description: 'File attachment field' },
  { value: 'image', label: 'Image Upload', icon: '🖼️', description: 'Image attachment field' },
  { value: 'rating', label: 'Rating Scale', icon: '⭐', description: 'Star rating or scale input' },
  { value: 'slider', label: 'Slider', icon: '📊', description: 'Range slider input' },
  { value: 'section', label: 'Section Heading', icon: '📋', description: 'Organize fields into sections' },
  { value: 'divider', label: 'Divider Line', icon: '➖', description: 'Visual separator' },
  { value: 'info', label: 'Information Text', icon: 'ℹ️', description: 'Display-only text block' }
];

export const EnhancedFieldEditor: React.FC<EnhancedFieldEditorProps> = ({
  field,
  index,
  totalFields,
  scoringEnabled,
  onUpdate,
  onDelete,
  onMove
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [newChoice, setNewChoice] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const getFieldTypeInfo = (type: string) => {
    return FIELD_TYPES.find(t => t.value === type) || FIELD_TYPES[0];
  };

  const typeInfo = getFieldTypeInfo(field.field_type);

  const validateField = () => {
    const errors: string[] = [];
    
    if (!field.label?.trim()) {
      errors.push('Field name is required');
    }
    
    if (['select', 'multiselect', 'radio'].includes(field.field_type)) {
      if (!field.options?.choices || field.options.choices.length === 0) {
        errors.push('At least one option is required');
      }
    }
    
    if (field.field_type === 'rating' && (!field.options?.maxRating || field.options.maxRating < 1)) {
      errors.push('Maximum rating must be at least 1');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFieldUpdate = (updates: Partial<ProcedureField>) => {
    onUpdate(updates);
    setTimeout(validateField, 100);
  };

  const addChoice = () => {
    if (!newChoice.trim()) return;
    
    const currentChoices = field.options?.choices || [];
    handleFieldUpdate({
      options: { 
        ...field.options, 
        choices: [...currentChoices, newChoice.trim()] 
      }
    });
    setNewChoice('');
    toast.success('Option added');
  };

  const removeChoice = (indexToRemove: number) => {
    const currentChoices = field.options?.choices || [];
    handleFieldUpdate({
      options: { 
        ...field.options, 
        choices: currentChoices.filter((_, i) => i !== indexToRemove)
      }
    });
    toast.success('Option removed');
  };

  const duplicateField = () => {
    // This would need to be handled by the parent component
    toast.success('Field duplicated');
  };

  // Special rendering for non-input field types
  if (['section', 'divider', 'info'].includes(field.field_type)) {
    return (
      <Card className={`border-l-4 transition-all duration-200 hover:shadow-md ${
        field.field_type === 'section' ? 'border-l-purple-400 bg-purple-50/30' :
        field.field_type === 'divider' ? 'border-l-gray-400 bg-gray-50/30' :
        'border-l-blue-400 bg-blue-50/30'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMove('up')}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              
              <GripVertical className="h-4 w-4 text-gray-400" />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMove('down')}
                disabled={index === totalFields - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{typeInfo.icon}</span>
                <Badge variant="secondary" className="text-xs">{typeInfo.label}</Badge>
              </div>
              
              {field.field_type === 'section' && (
                <Input
                  value={field.label}
                  onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                  placeholder="Section heading"
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                />
              )}
              
              {field.field_type === 'info' && (
                <Textarea
                  value={field.options?.infoText || ''}
                  onChange={(e) => handleFieldUpdate({
                    options: { ...field.options, infoText: e.target.value }
                  })}
                  placeholder="Information text to display"
                  className="border-none p-0 bg-transparent resize-none"
                  rows={2}
                />
              )}
              
              {field.field_type === 'divider' && (
                <div className="text-sm text-gray-500">Visual separator line</div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 transition-all duration-200 hover:shadow-md ${
      field.field_type === 'text' || field.field_type === 'textarea' ? 'border-l-blue-400' :
      field.field_type === 'number' ? 'border-l-green-400' :
      field.field_type === 'email' ? 'border-l-purple-400' :
      field.field_type === 'checkbox' ? 'border-l-orange-400' :
      field.field_type === 'select' || field.field_type === 'radio' ? 'border-l-pink-400' :
      field.field_type === 'multiselect' ? 'border-l-indigo-400' :
      field.field_type === 'date' || field.field_type === 'time' || field.field_type === 'datetime' ? 'border-l-cyan-400' :
      field.field_type === 'file' || field.field_type === 'image' ? 'border-l-yellow-400' :
      field.field_type === 'rating' || field.field_type === 'slider' ? 'border-l-red-400' :
      'border-l-gray-400'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle & Controls */}
          <div className="flex flex-col items-center gap-1 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="h-6 w-6 p-0"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            
            <div className="flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                {index + 1}
              </Badge>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('down')}
              disabled={index === totalFields - 1}
              className="h-6 w-6 p-0"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          {/* Field Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeInfo.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {field.label || 'Untitled Field'}
                  </h4>
                  <p className="text-xs text-gray-500">{typeInfo.description}</p>
                </div>
                {field.is_required && (
                  <Badge variant="destructive" className="text-xs px-1 py-0 h-5">
                    Required
                  </Badge>
                )}
                {scoringEnabled && (
                  <Badge variant="outline" className="text-xs px-1 py-0 h-5 gap-1">
                    <Star className="h-3 w-3" />
                    {field.options?.points || 1}
                  </Badge>
                )}
                {validationErrors.length > 0 && (
                  <Badge variant="destructive" className="text-xs px-1 py-0 h-5 gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.length}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  title="Toggle preview"
                >
                  {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={duplicateField}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  title="Duplicate field"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  title="Link to procedure"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  title="Add attachment"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                {validationErrors.map((error, i) => (
                  <div key={i} className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible Content */}
            {isExpanded && !previewMode && (
              <div className="space-y-4">
                {/* Field Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Field Name *</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                      placeholder="Enter field name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Field Type</Label>
                    <Select
                      value={field.field_type}
                      onValueChange={(value) => handleFieldUpdate({ 
                        field_type: value as ProcedureField['field_type'],
                        options: ['select', 'multiselect', 'radio'].includes(value) ? { choices: [] } : 
                                value === 'rating' ? { maxRating: 5, minRating: 1 } :
                                value === 'slider' ? { minValue: 0, maxValue: 100, step: 1 } : {}
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {FIELD_TYPES.filter(type => !['section', 'divider', 'info'].includes(type.value)).map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Help Text */}
                <div>
                  <Label className="text-sm font-medium">Help Text (Optional)</Label>
                  <Textarea
                    value={field.options?.helpText || ''}
                    onChange={(e) => handleFieldUpdate({
                      options: { ...field.options, helpText: e.target.value }
                    })}
                    placeholder="Add instructions or help text for this field"
                    rows={2}
                    className="mt-1 resize-none"
                  />
                </div>

                {/* Field-specific options */}
                {(['select', 'multiselect', 'radio'].includes(field.field_type)) && (
                  <div>
                    <Label className="text-sm font-medium">Options</Label>
                    <div className="mt-2 space-y-2">
                      {field.options?.choices?.map((choice, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input value={choice} readOnly className="flex-1" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChoice(i)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          value={newChoice}
                          onChange={(e) => setNewChoice(e.target.value)}
                          placeholder="Add new option"
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && addChoice()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addChoice}
                          disabled={!newChoice.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {field.field_type === 'rating' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Maximum Rating</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={field.options?.maxRating || 5}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, maxRating: parseInt(e.target.value) || 5 }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Minimum Rating</Label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        value={field.options?.minRating || 1}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, minRating: parseInt(e.target.value) || 1 }
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {field.field_type === 'slider' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Min Value</Label>
                      <Input
                        type="number"
                        value={field.options?.minValue || 0}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, minValue: parseInt(e.target.value) || 0 }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Max Value</Label>
                      <Input
                        type="number"
                        value={field.options?.maxValue || 100}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, maxValue: parseInt(e.target.value) || 100 }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Step</Label>
                      <Input
                        type="number"
                        value={field.options?.step || 1}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, step: parseInt(e.target.value) || 1 }
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {['number', 'text', 'textarea'].includes(field.field_type) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Placeholder Text</Label>
                      <Input
                        value={field.options?.placeholder || ''}
                        onChange={(e) => handleFieldUpdate({
                          options: { ...field.options, placeholder: e.target.value }
                        })}
                        placeholder="Enter placeholder text"
                        className="mt-1"
                      />
                    </div>
                    {field.field_type === 'number' && (
                      <div>
                        <Label className="text-sm font-medium">Default Value</Label>
                        <Input
                          type="number"
                          value={field.options?.defaultValue || ''}
                          onChange={(e) => handleFieldUpdate({
                            options: { ...field.options, defaultValue: e.target.value }
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.is_required}
                        onCheckedChange={(checked) => handleFieldUpdate({ is_required: checked })}
                      />
                      <Label className="text-sm">Required</Label>
                    </div>
                    
                    {scoringEnabled && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Points:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={field.options?.points || 1}
                          onChange={(e) => handleFieldUpdate({
                            options: { ...field.options, points: parseInt(e.target.value) || 1 }
                          })}
                          className="w-16 h-8"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </div>
            )}

            {/* Preview Mode */}
            {previewMode && (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg p-4 border border-slate-200">
                <div className="mb-2">
                  <Label className="text-sm font-medium">
                    {field.label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.options?.helpText && (
                    <p className="text-xs text-gray-600 mt-1">{field.options.helpText}</p>
                  )}
                </div>
                
                {/* Enhanced Field Preview */}
                {field.field_type === 'text' && (
                  <Input 
                    placeholder={field.options?.placeholder || "Text input preview"}
                    className="bg-white"
                    disabled
                  />
                )}
                {field.field_type === 'textarea' && (
                  <Textarea 
                    placeholder={field.options?.placeholder || "Long text input preview"}
                    className="bg-white resize-none"
                    rows={3}
                    disabled
                  />
                )}
                {field.field_type === 'number' && (
                  <Input 
                    type="number" 
                    placeholder={field.options?.placeholder || "0"}
                    className="bg-white"
                    disabled
                  />
                )}
                {field.field_type === 'email' && (
                  <Input 
                    type="email" 
                    placeholder="email@example.com"
                    className="bg-white"
                    disabled
                  />
                )}
                {field.field_type === 'checkbox' && (
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 mr-2" disabled />
                    <span className="text-sm text-gray-700">Checkbox option</span>
                  </label>
                )}
                {field.field_type === 'select' && (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" disabled>
                    <option>Select an option...</option>
                    {field.options?.choices?.map((choice, i) => (
                      <option key={i}>{choice}</option>
                    ))}
                  </select>
                )}
                {field.field_type === 'multiselect' && (
                  <div className="space-y-2">
                    {(field.options?.choices || ['Option 1', 'Option 2']).slice(0, 3).map((choice, i) => (
                      <label key={i} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 mr-2" disabled />
                        <span className="text-sm text-gray-700">{choice}</span>
                      </label>
                    ))}
                  </div>
                )}
                {field.field_type === 'radio' && (
                  <div className="space-y-2">
                    {(field.options?.choices || ['Option 1', 'Option 2']).slice(0, 3).map((choice, i) => (
                      <label key={i} className="flex items-center">
                        <input type="radio" name={`radio-${field.id}`} className="mr-2" disabled />
                        <span className="text-sm text-gray-700">{choice}</span>
                      </label>
                    ))}
                  </div>
                )}
                {field.field_type === 'date' && (
                  <Input 
                    type="date"
                    className="bg-white"
                    disabled
                  />
                )}
                {field.field_type === 'rating' && (
                  <div className="flex gap-1">
                    {Array.from({ length: field.options?.maxRating || 5 }, (_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-300" />
                    ))}
                  </div>
                )}
                {field.field_type === 'slider' && (
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min={field.options?.minValue || 0}
                      max={field.options?.maxValue || 100}
                      step={field.options?.step || 1}
                      className="w-full"
                      disabled
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{field.options?.minValue || 0}</span>
                      <span>{field.options?.maxValue || 100}</span>
                    </div>
                  </div>
                )}
                {field.field_type === 'file' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload file</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
