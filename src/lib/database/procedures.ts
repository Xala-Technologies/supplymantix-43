
import { supabase } from "@/integrations/supabase/client";

export const proceduresApi = {
  getProcedures: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("procedures")
      .select("*")
      .eq("tenant_id", userRecord.tenant_id);

    if (error) throw error;
    return data || [];
  },

  createProcedure: async (procedure: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("procedures")
      .insert({ ...procedure, tenant_id: userRecord.tenant_id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateProcedure: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("procedures")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteProcedure: async (id: string) => {
    const { error } = await supabase
      .from("procedures")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
