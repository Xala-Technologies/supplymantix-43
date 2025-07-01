
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface RatingOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const RatingOptions: React.FC<RatingOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">Rating Configuration</Label>
      <div className="flex items-center space-x-4">
        <div>
          <Label className="text-xs text-gray-600">Max Stars</Label>
          <Select
            value={String(field.options?.maxRating || 5)}
            onValueChange={(value) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                maxRating: parseInt(value)
              }
            })}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`allow-half-stars-${index}`}
            checked={field.options?.allowHalfStars || false}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                allowHalfStars: Boolean(checked)
              }
            })}
          />
          <Label htmlFor={`allow-half-stars-${index}`} className="text-sm">
            Allow half stars
          </Label>
        </div>
      </div>
    </div>
  );
};
