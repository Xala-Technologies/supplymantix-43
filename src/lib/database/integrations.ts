
import { supabase } from "@/integrations/supabase/client";

export const integrationsApi = {
  async recordPartsUsage(data: {
    work_order_id: string;
    inventory_item_id: string;
    quantity: number;
    notes?: string;
  }) {
    // This calls the database function that handles the transaction
    const { data: result, error } = await supabase.rpc('record_parts_usage', {
      wo_id: data.work_order_id,
      item_id: data.inventory_item_id,
      qty: data.quantity,
      usage_notes: data.notes || ''
    });
    
    if (error) throw error;
    return result;
  },

  async updateWorkOrderStatus(id: string, status: string, notes?: string) {
    const updates: any = { status };
    if (notes) {
      updates.notes = notes;
    }
    
    const { data, error } = await supabase
      .from("work_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async attachProcedureToWorkOrder(workOrderId: string, procedureId: string) {
    // For now, we'll update the work order with procedure info
    // In the future, this could use the work_order_procedures table
    const { data, error } = await supabase
      .from("work_orders")
      .select('*')
      .eq("id", workOrderId)
      .single();
    
    if (error) throw error;
    
    // Update with procedure attachment logic
    const { data: result, error: updateError } = await supabase
      .from("work_orders")
      .update({ 
        description: `${data.description || ''}\n\nProcedure ${procedureId} attached.`
      })
      .eq("id", workOrderId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    return result;
  },

  async getWorkOrderWithDetails(id: string) {
    const { data, error } = await supabase
      .from("work_orders")
      .select(`
        *,
        assets(name, location, status),
        users(email),
        locations(name)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
