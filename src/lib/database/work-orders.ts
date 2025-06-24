
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const workOrdersApi = {
  async getWorkOrders() {
    const { data, error } = await supabase
      .from("work_orders")
      .select(`
        *,
        assets(name, location),
        users!work_orders_assigned_to_fkey(email),
        locations(name)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createWorkOrder(workOrder: Tables["work_orders"]["Insert"]) {
    const { data, error } = await supabase
      .from("work_orders")
      .insert(workOrder)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWorkOrder(id: string, updates: Tables["work_orders"]["Update"]) {
    const { data, error } = await supabase
      .from("work_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getChatMessages(workOrderId: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        users(email)
      `)
      .eq("work_order_id", workOrderId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createChatMessage(message: Tables["chat_messages"]["Insert"]) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
