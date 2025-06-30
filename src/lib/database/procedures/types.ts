
export type ProcedureFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'select' 
  | 'multi_select' 
  | 'checkbox' 
  | 'date' 
  | 'time' 
  | 'file_upload' 
  | 'signature';

export interface ProcedureField {
  id: string;
  procedure_id: string;
  label: string;
  field_type: ProcedureFieldType;
  is_required: boolean;
  order_index: number;
  options: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Procedure {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  asset_type?: string;
  category: string;
  tags: string[];
  is_global: boolean;
  template_data: Record<string, any>;
  steps?: Record<string, any>;
  estimated_duration?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  asset_ids: string[];
  location_ids: string[];
  team_ids: string[];
  fields?: ProcedureField[];
  executions_count?: number;
}

export interface ProcedureInsert {
  title: string;
  description?: string;
  asset_type?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  template_data?: Record<string, any>;
  steps?: Record<string, any>;
  estimated_duration?: number;
  asset_ids?: string[];
  location_ids?: string[];
  team_ids?: string[];
  fields?: Omit<ProcedureField, 'id' | 'procedure_id' | 'created_at' | 'updated_at'>[];
}

export interface ProcedureUpdate {
  title?: string;
  description?: string;
  asset_type?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  template_data?: Record<string, any>;
  steps?: Record<string, any>;
  estimated_duration?: number;
  asset_ids?: string[];
  location_ids?: string[];
  team_ids?: string[];
}

export interface ProcedureExecution {
  id: string;
  procedure_id: string;
  work_order_id?: string;
  user_id?: string;
  tenant_id: string;
  answers: Record<string, any>;
  score: number;
  status: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProcedureTemplate {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  template_data: Record<string, any>;
  tags: string[];
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
