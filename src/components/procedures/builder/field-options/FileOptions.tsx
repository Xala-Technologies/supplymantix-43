
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FileOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const FileOptions: React.FC<FileOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
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
};
