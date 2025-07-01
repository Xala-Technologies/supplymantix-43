
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paperclip, X } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface AttachedFileSectionProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const AttachedFileSection: React.FC<AttachedFileSectionProps> = ({
  field,
  index,
  onUpdate
}) => {
  if (!field.options?.attachedFile) return null;

  return (
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
  );
};
