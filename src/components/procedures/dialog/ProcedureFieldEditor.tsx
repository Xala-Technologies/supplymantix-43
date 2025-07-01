
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2 } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures/types';

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' },
  { value: 'section', label: 'Section Header' },
  { value: 'info', label: 'Information' }
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
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1 pt-1">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <Badge variant="outline" className="text-xs px-1 py-0">
              {index + 1}
            </Badge>
          </div>

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  onValueChange={(value) => onUpdate(index, { field_type: value as ProcedureField['field_type'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(field.field_type === 'select' || field.field_type === 'multiselect' || field.field_type === 'radio') && (
              <div>
                <Label className="text-sm font-medium">Options (one per line)</Label>
                <Textarea
                  value={field.options?.choices?.join('\n') || ''}
                  onChange={(e) =>
                    onUpdate(index, {
                      options: { 
                        ...field.options, 
                        choices: e.target.value.split('\n').filter(Boolean) 
                      }
                    })
                  }
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={Boolean(field.is_required)}
                  onCheckedChange={(checked) => onUpdate(index, { is_required: Boolean(checked) })}
                />
                <Label htmlFor={`required-${index}`} className="text-sm">Required</Label>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(index, 'up')}
                  disabled={index === 0}
                  className="h-7 w-7 p-0"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(index, 'down')}
                  disabled={index === totalFields - 1}
                  className="h-7 w-7 p-0"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
