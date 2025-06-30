
import { ProcedureExecution } from './types';

export const createProcedureExecution = (data: any): ProcedureExecution => {
  return {
    id: data.id,
    procedure_id: data.procedure_id,
    work_order_id: data.work_order_id,
    user_id: data.user_id,
    tenant_id: data.tenant_id,
    answers: data.answers,
    score: data.score,
    status: data.status,
    started_at: data.started_at,
    completed_at: data.completed_at,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
