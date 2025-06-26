
export type ProcedureFieldType = 
  | 'text'
  | 'textarea' 
  | 'number'
  | 'amount'
  | 'email'
  | 'url'
  | 'phone'
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'rating'
  | 'slider'
  | 'section'
  | 'divider'
  | 'info'
  | 'inspection';

export interface ProcedureField {
  id: string;
  procedure_id: string;
  field_type: ProcedureFieldType;
  label: string;
  is_required: boolean;
  order_index: number;
  options?: {
    choices?: string[];
    placeholder?: string;
    helpText?: string;
    defaultValue?: string | number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    minRating?: number;
    maxRating?: number;
    points?: number;
    passFailCriteria?: 'pass' | 'fail';
    requiresSignature?: boolean;
    allowMultipleFiles?: boolean;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    showInSummary?: boolean;
    attachedFile?: {
      name: string;
      url: string;
      type: string;
      size: number;
    };
    image?: string;
    infoText?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProcedureExecution {
  id?: string;
  procedure_id: string;
  work_order_id?: string;
  user_id?: string;
  tenant_id: string;
  answers: any;
  score?: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
}

export interface ProcedureTemplate {
  id?: string;
  tenant_id: string;
  name: string;
  description?: string;
  template_data: any;
  tags?: string[];
  is_public: boolean;
  created_by?: string;
}

export interface ProcedureWithFields {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  created_at: string;
  updated_at: string;
  fields?: ProcedureField[];
  executions_count?: number;
}
