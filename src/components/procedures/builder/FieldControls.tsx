
import React from 'react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { MoveControls } from './controls/MoveControls';
import { ActionButtons } from './controls/ActionButtons';
import { RequiredToggle } from './controls/RequiredToggle';
import { FieldOptionsMenu } from './controls/FieldOptionsMenu';

interface FieldControlsProps {
  field: ProcedureField;
  index: number;
  fieldsLength: number;
  onMove?: (index: number, direction: 'up' | 'down') => void;
  onUpdate?: (index: number, updates: Partial<ProcedureField>) => void;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAttachmentClick: (index: number) => void;
  onSelect: (index: number) => void;
  onExpand: (index: number) => void;
}

export const FieldControls: React.FC<FieldControlsProps> = ({
  field,
  index,
  fieldsLength,
  onMove,
  onUpdate,
  onDuplicate,
  onDelete,
  onAttachmentClick,
  onSelect,
  onExpand
}) => {
  return (
    <div className="flex items-center gap-1">
      <MoveControls
        index={index}
        fieldsLength={fieldsLength}
        onMove={onMove}
      />

      <ActionButtons
        field={field}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAttachmentClick={onAttachmentClick}
      />

      <RequiredToggle
        field={field}
        index={index}
        onUpdate={onUpdate}
      />

      <FieldOptionsMenu
        index={index}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onSelect={onSelect}
        onExpand={onExpand}
      />
    </div>
  );
};
