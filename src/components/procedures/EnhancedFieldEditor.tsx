
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical, ChevronUp, ChevronDown, Link, Paperclip, Star } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";

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
  { value: 'text', label: 'Text Field', icon: '📝' },
  { value: 'number', label: 'Number Field', icon: '#️⃣' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'select', label: 'Multiple Choice', icon: '🔘' },
  { value: 'multiselect', label: 'Checklist', icon: '✅' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'section', label: 'Heading', icon: '📋' }
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

  const getFieldTypeInfo = (type: string) => {
    return FIELD_TYPES.find(t => t.value === type) || FIELD_TYPES[0];
  };

  const typeInfo = getFieldTypeInfo(field.field_type);

  if (field.field_type === 'section') {
    return (
      <Card className="border-l-4 border-l-purple-400 bg-purple-50/50">
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
                <span className="text-lg">📋</span>
                <Badge variant="secondary" className="text-xs">Heading</Badge>
              </div>
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Section heading"
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
              />
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
    <Card className={`border-l-4 ${
      field.field_type === 'text' ? 'border-l-blue-400' :
      field.field_type === 'number' ? 'border-l-green-400' :
      field.field_type === 'checkbox' ? 'border-l-orange-400' :
      field.field_type === 'select' ? 'border-l-pink-400' :
      field.field_type === 'multiselect' ? 'border-l-indigo-400' :
      'border-l-gray-400'
    } transition-all duration-200 hover:shadow-md`}>
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
                <h4 className="font-medium text-gray-900">
                  {field.label || 'Untitled Field'}
                </h4>
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
              </div>
              
              <div className="flex items-center gap-1">
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

            {/* Collapsible Content */}
            {isExpanded && (
              <div className="space-y-4">
                {/* Field Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Field Name</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => onUpdate({ label: e.target.value })}
                      placeholder="Enter field name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Field Type</Label>
                    <Select
                      value={field.field_type}
                      onValueChange={(value) => onUpdate({ 
                        field_type: value as ProcedureField['field_type'],
                        options: value === 'select' || value === 'multiselect' ? { choices: [] } : {}
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
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
                    onChange={(e) => onUpdate({
                      options: { ...field.options, helpText: e.target.value }
                    })}
                    placeholder="Add instructions or help text for this field"
                    rows={2}
                    className="mt-1 resize-none"
                  />
                </div>

                {/* Options for Select/Multiselect */}
                {(field.field_type === 'select' || field.field_type === 'multiselect') && (
                  <div>
                    <Label className="text-sm font-medium">Options (one per line)</Label>
                    <Textarea
                      value={field.options?.choices?.join('\n') || ''}
                      onChange={(e) =>
                        onUpdate({
                          options: { 
                            ...field.options, 
                            choices: e.target.value.split('\n').filter(Boolean) 
                          }
                        })
                      }
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      rows={3}
                      className="mt-1 resize-none"
                    />
                  </div>
                )}

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.is_required}
                        onCheckedChange={(checked) => onUpdate({ is_required: checked })}
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
                          onChange={(e) => onUpdate({
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
