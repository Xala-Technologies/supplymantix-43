
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UnifiedProcedureBuilder } from './UnifiedProcedureBuilder';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface ProcedureBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  };
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  }) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const ProcedureBuilderModal: React.FC<ProcedureBuilderModalProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
  isLoading = false,
  mode = 'create'
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none">
        <UnifiedProcedureBuilder
          initialData={initialData}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
