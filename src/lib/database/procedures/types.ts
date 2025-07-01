
export type ProcedureFieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'amount'
  | 'email'
  | 'url'
  | 'phone'
  | 'select' 
  | 'multi_select'
  | 'multiselect' // Keep both for compatibility
  | 'radio'
  | 'checkbox' 
  | 'date' 
  | 'time'
  | 'datetime'
  | 'file_upload'
  | 'file' // Keep both for compatibility
  | 'image'
  | 'signature'
  | 'rating'
  | 'slider'
  | 'section'
  | 'divider'
  | 'info'
  | 'inspection';

export interface ProcedureField {
  id: string;
  procedure_id: string;
  label: string;
  field_type: string; // Keep as string to match database
  is_required: boolean;
  order_index: number;
  options: any; // Changed from Record<string, any> to any to match Supabase Json type
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
  template_data: any; // Changed from Record<string, any> to any to match Supabase Json type
  steps?: any; // Changed from Record<string, any> to any
  estimated_duration?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  asset_ids: string[];
  location_ids: string[];
  team_ids: string[];
  fields?: ProcedureField[];
  executions_count?: number; // Add this missing property
}

// Add the missing ProcedureWithFields type that components are trying to import
export interface ProcedureWithFields extends Procedure {
  fields: ProcedureField[];
}

export interface ProcedureInsert {
  title: string;
  description?: string;
  asset_type?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  template_data?: any; // Changed from Record<string, any> to any
  steps?: any; // Changed from Record<string, any> to any
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
  template_data?: any; // Changed from Record<string, any> to any
  steps?: any; // Changed from Record<string, any> to any
  estimated_duration?: number;
  asset_ids?: string[];
  location_ids?: string[];
  team_ids?: string[];
  fields?: ProcedureField[]; // Add fields to update interface
}

// Add the missing type exports
export interface CreateProcedureData extends ProcedureInsert {}

export interface UpdateProcedureData extends ProcedureUpdate {}

export interface ProcedureFilters {
  search?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProcedureExecution {
  id: string;
  procedure_id: string;
  work_order_id?: string;
  user_id?: string;
  tenant_id: string;
  answers: any; // Changed from Record<string, any> to any
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
  template_data: any; // Changed from Record<string, any> to any
  tags: string[];
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
