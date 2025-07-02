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

    // Get user's tenant_id from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      // If user doesn't exist in users table, create them
      if (userError.code === 'PGRST116') {
        console.log('User not found in users table, this might be expected for new users');
        return [];
      }
      throw userError;
    }

    if (!userData) {
      console.log('No user data found, returning empty array');
      return [];
    }

    console.log('User tenant_id:', userData.tenant_id);

    // Fetch work orders with proper joins - alias assets as asset
    const { data, error } = await supabase
      .from("work_orders")
      .select(`
        *,
        asset:assets(id, name, location),
        assigned_user:users!work_orders_assigned_to_fkey(id, email, first_name, last_name),
        location:locations(id, name)
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
        users(email, first_name, last_name)
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
