import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const workOrdersApi = {
  async getWorkOrders() {
    console.log('workOrdersApi.getWorkOrders - Starting to fetch work orders...');
    
    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }
    
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    console.log('Authenticated user:', user.id);

    // Get user's tenant_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      throw userError;
    }

    if (!userData) {
      console.error('No user data found');
      throw new Error('User data not found');
    }

    console.log('User tenant_id:', userData.tenant_id);

    const { data, error } = await supabase
      .from("work_orders")
      .select(`
        *,
        assets(name, location),
        users!work_orders_assigned_to_fkey(email),
        locations(name)
      `)
      .eq("tenant_id", userData.tenant_id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error('Error fetching work orders:', error);
      throw error;
    }
    
    console.log('Fetched work orders:', data?.length || 0, 'records');
    console.log('Work orders data:', data);
    
    return data || [];
  },

  async createWorkOrder(workOrder: Tables["work_orders"]["Insert"]) {
    console.log('workOrdersApi.createWorkOrder - Creating work order:', workOrder);
    
    const { data, error } = await supabase
      .from("work_orders")
      .insert(workOrder)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating work order:', error);
      throw error;
    }
    
    console.log('Created work order:', data);
    return data;
  },

  async updateWorkOrder(id: string, updates: Tables["work_orders"]["Update"]) {
    console.log('workOrdersApi.updateWorkOrder - Updating work order:', id, updates);
    
    const { data, error } = await supabase
      .from("work_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating work order:', error);
      throw error;
    }
    
    console.log('Updated work order:', data);
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
