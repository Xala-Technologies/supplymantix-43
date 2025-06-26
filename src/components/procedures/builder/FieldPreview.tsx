
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface FieldPreviewProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const FieldPreview: React.FC<FieldPreviewProps> = ({ field, index, onUpdate }) => {
  return (
    <>
      {/* Attached File Preview */}
      {field.options?.attachedFile && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center gap-3">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-sm text-gray-700">{field.options.attachedFile.name}</div>
                <div className="text-xs text-gray-500">
                  ({(field.options.attachedFile.size / 1024).toFixed(1)} KB)
                </div>
              </div>
              {field.options.attachedFile.type.startsWith('image/') && (
                <img 
                  src={field.options.attachedFile.url} 
                  alt="Preview" 
                  className="w-12 h-12 object-cover rounded border"
                />
              )}
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
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Field Options Preview */}
      {(field.field_type === 'select' || field.field_type === 'multiselect') && field.options?.choices && field.options.choices.length > 0 && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">Options:</div>
            <div className="flex flex-wrap gap-1">
              {field.options.choices.slice(0, 3).map((choice, choiceIndex) => (
                <span key={choiceIndex} className="text-xs bg-white px-2 py-1 rounded border">
                  {choice}
                </span>
              ))}
              {field.options.choices.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{field.options.choices.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text Preview */}
      {field.options?.helpText && (
        <div className="px-4 pb-4 pt-0">
          <div className="text-xs text-gray-500 italic">
            Help: {field.options.helpText}
          </div>
        </div>
      )}
    </>
  );
};
