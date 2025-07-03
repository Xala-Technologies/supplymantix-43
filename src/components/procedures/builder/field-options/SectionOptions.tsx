import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface SectionOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const SectionOptions: React.FC<SectionOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  return (
    <div className="space-y-4">
      {/* Section Description */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Section Description</Label>
        <Textarea
          value={field.options?.description || ''}
          onChange={(e) => onUpdate && onUpdate(index, {
            options: {
              ...field.options,
              description: e.target.value
            }
          })}
          placeholder="Optional description for this section"
          rows={2}
          className="resize-none text-sm"
        />
      </div>

      {/* Collapsible Option */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`collapsible-${index}`}
          checked={field.options?.collapsible || false}
          onCheckedChange={(checked) => onUpdate && onUpdate(index, {
            options: {
              ...field.options,
              collapsible: Boolean(checked)
            }
          })}
        />
        <Label htmlFor={`collapsible-${index}`} className="text-sm">
          Make section collapsible
        </Label>
      </div>

      {/* Default Collapsed State (only show if collapsible is enabled) */}
      {field.options?.collapsible && (
        <div className="flex items-center space-x-2 ml-6">
          <Checkbox
            id={`collapsed-${index}`}
            checked={field.options?.defaultCollapsed || false}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                defaultCollapsed: Boolean(checked)
              }
            })}
          />
          <Label htmlFor={`collapsed-${index}`} className="text-sm">
            Start collapsed by default
          </Label>
        </div>
      )}

      {/* Section Style */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Section Style</Label>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              (field.options?.style || 'simple') === 'simple'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                style: 'simple'
              }
            })}
          >
            <div className="text-sm font-medium">Simple</div>
            <div className="text-xs text-gray-500">Basic section header</div>
          </div>
          <div
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              field.options?.style === 'card'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                style: 'card'
              }
            })}
          >
            <div className="text-sm font-medium">Card</div>
            <div className="text-xs text-gray-500">Contained section</div>
          </div>
        </div>
      </div>
    </div>
  );
};