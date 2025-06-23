
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";
import { FieldTypeSelector } from "./FieldTypeSelector";

interface FieldEditorProps {
  field: ProcedureField;
  index: number;
  totalFields: number;
  onUpdate: (field: Partial<ProcedureField>) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  totalFields,
  onUpdate,
  onDelete,
  onMove
}) => {
  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'text': 'border-l-blue-400',
      'number': 'border-l-green-400',
      'date': 'border-l-purple-400',
      'checkbox': 'border-l-orange-400',
      'select': 'border-l-pink-400',
      'multiselect': 'border-l-indigo-400',
      'file': 'border-l-red-400',
      'section': 'border-l-gray-400'
    };
    return colors[type] || 'border-l-gray-400';
  };

  return (
    <Card className={`border-l-4 ${getFieldTypeColor(field.field_type)} hover:shadow-md transition-shadow`}>
      <CardContent className="p-2">
        <div className="flex items-start gap-2">
          {/* Drag Handle & Order Controls */}
          <div className="flex flex-col items-center gap-0.5 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="h-4 w-4 p-0"
            >
              <ChevronUp className="h-2 w-2" />
            </Button>
            
            <div className="flex items-center gap-1">
              <GripVertical className="h-2 w-2 text-gray-400" />
              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                {index + 1}
              </Badge>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('down')}
              disabled={index === totalFields - 1}
              className="h-4 w-4 p-0"
            >
              <ChevronDown className="h-2 w-2" />
            </Button>
          </div>

          {/* Field Configuration */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 text-xs">
                  {field.label || 'New Field'}
                </h4>
                {field.is_required && (
                  <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
                    Required
                  </Badge>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-4 w-4 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-2 w-2" />
              </Button>
            </div>

            {/* Field Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor={`field-${index}-label`} className="text-xs font-medium">Field Label *</Label>
                <Input
                  id={`field-${index}-label`}
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="Enter field label"
                  className="h-6 text-xs"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Field Type</Label>
                <FieldTypeSelector
                  value={field.field_type}
                  onChange={(value) => onUpdate({ field_type: value as ProcedureField['field_type'] })}
                />
              </div>
            </div>

            {/* Options for Select/Multiselect */}
            {(field.field_type === 'select' || field.field_type === 'multiselect') && (
              <div className="space-y-1">
                <Label className="text-xs font-medium">Options (one per line)</Label>
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
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded border">
              <div>
                <Label htmlFor={`field-${index}-required`} className="text-xs font-medium">
                  Required Field
                </Label>
                <p className="text-xs text-gray-600">
                  Must be filled to complete
                </p>
              </div>
              <Switch
                id={`field-${index}-required`}
                checked={field.is_required}
                onCheckedChange={(checked) => onUpdate({ is_required: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
