
import { supabase } from "@/integrations/supabase/client";

export const executionsApi = {
  // Start a procedure execution
  startExecution: async (procedureId: string, workOrderId?: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("procedure_executions")
        .insert({
          procedure_id: procedureId,
          user_id: userData.user.id,
          work_order_id: workOrderId,
          tenant_id: userRecord.tenant_id,
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error starting procedure execution:", error);
      throw error;
    }
  },

  // Submit a procedure execution
  submitExecution: async (executionId: string, answers: any, score?: number) => {
    try {
      const { error } = await supabase
        .from("procedure_executions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          answers: answers,
          score: score,
        })
        .eq("id", executionId);

      if (error) throw error;
    } catch (error) {
      console.error("Error submitting procedure execution:", error);
      throw error;
    }
  },
};
