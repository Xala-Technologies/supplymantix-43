
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface InspectionOptionsProps {
  field: ProcedureField;
  index: number;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
}

export const InspectionOptions: React.FC<InspectionOptionsProps> = ({
  field,
  index,
  onUpdate
}) => {
  return (
    <div className="mb-4">
      <Label className="text-sm font-medium mb-2 block">Inspection Options</Label>
      <div className="p-4 bg-white rounded-lg border space-y-3">
        <div className="text-sm text-gray-600 mb-3">
          Users will be able to select: Pass, Fail, or Flag
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`allow-comments-${index}`}
            checked={field.options?.allowComments || false}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                allowComments: Boolean(checked)
              }
            })}
          />
          <Label htmlFor={`allow-comments-${index}`} className="text-sm">
            Allow comments for failed or flagged items
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`require-comment-fail-${index}`}
            checked={field.options?.requireCommentOnFail || false}
            onCheckedChange={(checked) => onUpdate && onUpdate(index, {
              options: {
                ...field.options,
                requireCommentOnFail: Boolean(checked)
              }
            })}
          />
          <Label htmlFor={`require-comment-fail-${index}`} className="text-sm">
            Require comment when marked as Failed
          </Label>
        </div>
      </div>
    </div>
  );
};
