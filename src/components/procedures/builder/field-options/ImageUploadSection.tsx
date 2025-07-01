
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface ImageUploadSectionProps {
  field: ProcedureField;
  index: number;
  showImageUpload: boolean;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onToggleImageUpload: (index: number) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  field,
  index,
  showImageUpload,
  onUpdate,
  onToggleImageUpload,
  onImageUpload
}) => {
  if (!showImageUpload) return null;

  return (
    <div className="mb-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Field Image</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleImageUpload(index)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {field.options?.image ? (
        <div className="relative">
          <img 
            src={field.options.image} 
            alt="Field" 
            className="w-full h-32 object-cover rounded border"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (onUpdate) {
                const newOptions = { ...field.options };
                delete newOptions.image;
                onUpdate(index, { options: newOptions });
              }
            }}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageUpload(index, e)}
            className="w-full text-sm"
          />
        </div>
      )}
    </div>
  );
};
