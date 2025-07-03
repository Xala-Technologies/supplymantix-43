
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProcedureDialogHeader } from './dialog/ProcedureDialogHeader';
import { ProcedureDialogContent } from './dialog/ProcedureDialogContent';
import { useProcedureDialogState } from './dialog/useProcedureDialogState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

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
    isSaving,
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

  // Always use editData when available (which includes saved changes), otherwise use procedure
  const displayData = editData && Object.keys(editData).length > 0 ? editData : procedure;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <DialogTitle className="sr-only">
            Procedure Details
          </DialogTitle>
          <ErrorBoundary fallback={<div>Error loading procedure header</div>}>
            <ProcedureDialogHeader
              procedure={displayData}
              isEditing={isEditing}
              isSaving={isSaving}
              editData={editData}
              onEditStart={handleEditStart}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onEditDataChange={handleEditDataChange}
            />
          </ErrorBoundary>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ErrorBoundary fallback={<div className="flex-1 flex items-center justify-center text-red-600 p-6">Error loading procedure content</div>}>
            <ProcedureDialogContent
              procedure={displayData}
              isEditing={isEditing}
              editData={editData}
              formData={formData}
              newTag={newTag}
              disableAutoSave={true}
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
          </ErrorBoundary>
        </div>
      </DialogContent>
    </Dialog>
  );
};
