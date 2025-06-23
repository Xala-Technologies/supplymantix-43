
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
      'text': 'bg-blue-100 text-blue-700 border-blue-200',
      'number': 'bg-green-100 text-green-700 border-green-200',
      'date': 'bg-purple-100 text-purple-700 border-purple-200',
      'checkbox': 'bg-orange-100 text-orange-700 border-orange-200',
      'select': 'bg-pink-100 text-pink-700 border-pink-200',
      'multiselect': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'file': 'bg-red-100 text-red-700 border-red-200',
      'section': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <Card className={`${getFieldTypeColor(field.field_type)} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Drag Handle & Order Controls */}
          <div className="flex flex-col items-center gap-1 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <Badge variant="outline" className="text-xs">
                {index + 1}
              </Badge>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onMove('down')}
              disabled={index === totalFields - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Field Configuration */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-900">
                  {field.label || 'New Field'}
                </h4>
                {field.is_required && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
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

            {/* Field Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`field-${index}-label`}>Field Label *</Label>
                <Input
                  id={`field-${index}-label`}
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="Enter field label"
                  className="bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Field Type</Label>
                <FieldTypeSelector
                  value={field.field_type}
                  onChange={(value) => onUpdate({ field_type: value as ProcedureField['field_type'] })}
                />
              </div>
            </div>

            {/* Options for Select/Multiselect */}
            {(field.field_type === 'select' || field.field_type === 'multiselect') && (
              <div className="space-y-2">
                <Label>Options (one per line)</Label>
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
                  rows={4}
                  className="bg-white"
                />
                <p className="text-sm text-gray-600">
                  Enter each option on a new line
                </p>
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border">
              <div>
                <Label htmlFor={`field-${index}-required`} className="font-medium">
                  Required Field
                </Label>
                <p className="text-sm text-gray-600">
                  Users must fill this field to complete the procedure
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
