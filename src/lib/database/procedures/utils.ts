
import { ProcedureField, ProcedureExecution } from './types';

export const mapFieldFromDB = (dbField: any): ProcedureField => ({
  id: dbField.id,
  procedure_id: dbField.procedure_id,
  label: dbField.label,
  field_type: dbField.field_type as ProcedureField['field_type'],
  is_required: dbField.is_required || false,
  order_index: dbField.field_order || 0,
  options: dbField.options || {},
  created_at: dbField.created_at,
  updated_at: dbField.updated_at
});

export const mapExecutionFromDB = (dbExecution: any): ProcedureExecution => ({
  id: dbExecution.id,
  procedure_id: dbExecution.procedure_id,
  work_order_id: dbExecution.work_order_id,
  user_id: dbExecution.user_id,
  tenant_id: dbExecution.tenant_id,
  answers: dbExecution.answers,
  score: dbExecution.score,
  status: dbExecution.status as ProcedureExecution['status'],
  started_at: dbExecution.started_at,
  completed_at: dbExecution.completed_at
});
