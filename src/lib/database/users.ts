
import { supabase } from "@/integrations/supabase/client";

export const usersApi = {
  getUsers: async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name");

    if (error) throw error;
    return data || [];
  },

  getUsersByTenant: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("tenant_id", userRecord.tenant_id);

    if (error) throw error;
    return data || [];
  },

  createUser: async (user: any) => {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateUser: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
