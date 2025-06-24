
import { supabase } from "@/integrations/supabase/client";

export const usersApi = {
  async getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("status", "active")
      .order("email");
    
    if (error) throw error;
    return data;
  },

  async getUsersByTenant() {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) throw new Error("No authenticated user");

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", currentUser.user.id)
      .single();

    if (userError) throw userError;

    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("tenant_id", userData.tenant_id)
      .eq("status", "active")
      .order("email");
    
    if (error) throw error;
    return data;
  }
};
