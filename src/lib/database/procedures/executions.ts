
import { supabase } from "@/integrations/supabase/client";
import { getCurrentTenantId } from "@/hooks/useInventoryHelpers";
import { ProcedureExecution } from './types';
import { mapExecutionFromDB } from './utils';

export const executionApi = {
  // Execute procedure
  async startExecution(procedureId: string, workOrderId?: string): Promise<ProcedureExecution> {
    console.log('Starting procedure execution:', procedureId);
    
    const tenantId = await getCurrentTenantId();
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .insert({
        procedure_id: procedureId,
        work_order_id: workOrderId,
        tenant_id: tenantId,
        status: 'in_progress',
        answers: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting execution:', error);
      throw error;
    }

    return mapExecutionFromDB(data);
  },

  // Submit execution
  async submitExecution(executionId: string, answers: any, score?: number): Promise<ProcedureExecution> {
    console.log('Submitting execution:', executionId, answers);
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .update({
        answers,
        score: score || 0,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq("id", executionId)
      .select()
      .single();

    if (error) {
      console.error('Error submitting execution:', error);
      throw error;
    }

    return mapExecutionFromDB(data);
  },

  // Get execution history
  async getExecutions(procedureId: string): Promise<ProcedureExecution[]> {
    console.log('Fetching executions for procedure:', procedureId);
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .select(`
        *,
        users(email, first_name, last_name),
        work_orders(title)
      `)
      .eq("procedure_id", procedureId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching executions:', error);
      throw error;
    }

    return (data || []).map(mapExecutionFromDB);
  }
};
