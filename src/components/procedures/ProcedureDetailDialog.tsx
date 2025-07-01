
import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ProcedureDialogHeader } from './dialog/ProcedureDialogHeader';
import { ProcedureDialogContent } from './dialog/ProcedureDialogContent';
import { useProcedureDialogState } from './dialog/useProcedureDialogState';

interface ProcedureDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any | null;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
}

export const ProcedureDetailDialog: React.FC<ProcedureDetailDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor
}) => {
  const {
    isEditing,
    editData,
    formData,
    newTag,
    setNewTag,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleEditDataChange,
    handleFieldChange,
    addTag,
    removeTag,
    addField,
    updateField,
    removeField,
    moveField
  } = useProcedureDialogState(procedure, open, onEdit);

  if (!procedure) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <ProcedureDialogHeader
            procedure={procedure}
            isEditing={isEditing}
            editData={editData}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditDataChange={handleEditDataChange}
          />
        </DialogHeader>

        <ProcedureDialogContent
          procedure={procedure}
          isEditing={isEditing}
          editData={editData}
          formData={formData}
          newTag={newTag}
          onFieldChange={handleFieldChange}
          onEditDataChange={handleEditDataChange}
          onNewTagChange={setNewTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onAddField={addField}
          onUpdateField={updateField}
          onMoveField={moveField}
          onRemoveField={removeField}
        />
      </DialogContent>
    </Dialog>
  );
};
