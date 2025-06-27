
import { supabase } from "@/integrations/supabase/client";

export const inventoryApi = {
  getInventoryItems: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("tenant_id", userRecord.tenant_id);

    if (error) throw error;
    return data || [];
  },

  createInventoryItem: async (item: any) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from("inventory_items")
      .insert({ ...item, tenant_id: userRecord.tenant_id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateInventoryItem: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("inventory_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteInventoryItem: async (id: string) => {
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
