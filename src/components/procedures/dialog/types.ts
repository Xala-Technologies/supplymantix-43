
import { ProcedureField } from '@/lib/database/procedures/types';

export interface ProcedureDialogState {
  isEditing: boolean;
  editData: any;
  formData: Record<string, any>;
  newTag: string;
  isSaving: boolean;
}

export interface ProcedureEditData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_global: boolean;
  fields: ProcedureField[];
}

export interface DialogStateHandlers {
  setNewTag: (tag: string) => void;
  handleEditStart: () => void;
  handleEditSave: () => Promise<void>;
  handleEditCancel: () => void;
  handleEditDataChange: (updates: any) => void;
  handleFieldChange: (fieldId: string, value: any) => void;
}

export interface TagOperations {
  addTag: () => void;
  removeTag: (tag: string) => void;
}

export interface FieldOperations {
  addField: () => void;
  updateField: (index: number, updates: Partial<ProcedureField>) => void;
  removeField: (index: number) => void;
  moveField: (index: number, direction: 'up' | 'down') => void;
}
