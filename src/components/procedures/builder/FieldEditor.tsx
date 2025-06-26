
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Link, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldEditorProps {
  field: ProcedureField;
  onUpdate: (field: Partial<ProcedureField>) => void;
  onRemove: () => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onRemove
}) => {
  return (
    <div className="border-t bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="flex-1 border-0 bg-transparent text-lg font-medium focus-visible:ring-0 px-0"
            placeholder="Field label"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              value={field.field_type}
              onValueChange={(value) => onUpdate({ field_type: value as ProcedureField['field_type'] })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Field</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Multiple Choice</SelectItem>
                <SelectItem value="multiselect">Checklist</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Required</Label>
              <Switch
                checked={field.is_required}
                onCheckedChange={(checked) => onUpdate({ is_required: checked })}
              />
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
