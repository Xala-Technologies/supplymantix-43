
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const workOrdersEnhancedApi = {
  // Work Order Templates
  async getWorkOrderTemplates() {
    const { data, error } = await supabase
      .from("work_order_templates")
      .select(`
        *,
        template_checklist_items(*)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createWorkOrderTemplate(template: Tables["work_order_templates"]["Insert"]) {
    const { data, error } = await supabase
      .from("work_order_templates")
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWorkOrderTemplate(id: string, updates: Tables["work_order_templates"]["Update"]) {
    const { data, error } = await supabase
      .from("work_order_templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWorkOrderTemplate(id: string) {
    const { error } = await supabase
      .from("work_order_templates")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Template Checklist Items
  async getTemplateChecklistItems(templateId: string) {
    const { data, error } = await supabase
      .from("template_checklist_items")
      .select("*")
      .eq("template_id", templateId)
      .order("order_index", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createTemplateChecklistItem(item: Tables["template_checklist_items"]["Insert"]) {
    const { data, error } = await supabase
      .from("template_checklist_items")
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTemplateChecklistItem(id: string, updates: Tables["template_checklist_items"]["Update"]) {
    const { data, error } = await supabase
      .from("template_checklist_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTemplateChecklistItem(id: string) {
    const { error } = await supabase
      .from("template_checklist_items")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Checklist Items
  async getChecklistItems(workOrderId: string) {
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("work_order_id", workOrderId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createChecklistItem(item: Tables["checklist_items"]["Insert"]) {
    const { data, error } = await supabase
      .from("checklist_items")
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateChecklistItem(id: string, updates: Tables["checklist_items"]["Update"]) {
    const { data, error } = await supabase
      .from("checklist_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteChecklistItem(id: string) {
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Attachments
  async getWorkOrderAttachments(workOrderId: string) {
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("work_order_id", workOrderId)
      .order("uploaded_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createAttachment(attachment: Tables["attachments"]["Insert"]) {
    const { data, error } = await supabase
      .from("attachments")
      .insert(attachment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAttachment(id: string) {
    const { error } = await supabase
      .from("attachments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Time Logs
  async getTimeLogs(workOrderId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("time_logs")
      .select(`
        *,
        users(email, first_name, last_name)
      `)
      .eq("work_order_id", workOrderId)
      .order("logged_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createTimeLog(timeLog: Omit<Tables["time_logs"]["Insert"], "user_id">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("time_logs")
      .insert({
        ...timeLog,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTimeLog(id: string, updates: Tables["time_logs"]["Update"]) {
    const { data, error } = await supabase
      .from("time_logs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTimeLog(id: string) {
    const { error } = await supabase
      .from("time_logs")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Comments
  async getWorkOrderComments(workOrderId: string) {
    const { data, error } = await supabase
      .from("work_order_comments")
      .select(`
        *,
        users(email, first_name, last_name)
      `)
      .eq("work_order_id", workOrderId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createWorkOrderComment(comment: Omit<Tables["work_order_comments"]["Insert"], "user_id">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("work_order_comments")
      .insert({
        ...comment,
        user_id: user.id
      })
      .select(`
        *,
        users(email, first_name, last_name)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWorkOrderComment(id: string, updates: Tables["work_order_comments"]["Update"]) {
    const { data, error } = await supabase
      .from("work_order_comments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteWorkOrderComment(id: string) {
    const { error } = await supabase
      .from("work_order_comments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Enhanced Work Order Operations
  async createWorkOrderFromTemplate(templateId: string, workOrderData: Partial<Tables["work_orders"]["Insert"]>) {
    // Get template with checklist items
    const { data: template, error: templateError } = await supabase
      .from("work_order_templates")
      .select(`
        *,
        template_checklist_items(*)
      `)
      .eq("id", templateId)
      .single();

    if (templateError) throw templateError;

    // Create work order with template data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    const workOrder = {
      title: workOrderData.title || template.title,
      description: workOrderData.description || template.description,
      priority: workOrderData.priority || template.priority,
      assigned_to: workOrderData.assigned_to || template.default_assignee,
      tags: workOrderData.tags || template.default_tags,
      template_id: templateId,
      tenant_id: userData.tenant_id,
      status: 'open' as const,
      ...workOrderData,
    };

    const { data: newWorkOrder, error: workOrderError } = await supabase
      .from("work_orders")
      .insert(workOrder)
      .select()
      .single();

    if (workOrderError) throw workOrderError;

    // Create checklist items from template
    if (template.template_checklist_items?.length > 0) {
      const checklistItems = template.template_checklist_items.map(item => ({
        work_order_id: newWorkOrder.id,
        title: item.title,
        note: item.note,
      }));

      const { error: checklistError } = await supabase
        .from("checklist_items")
        .insert(checklistItems);

      if (checklistError) throw checklistError;
    }

    return newWorkOrder;
  },

  async updateWorkOrderStatus(id: string, status: string, notes?: string) {
    const { data, error } = await supabase
      .from("work_orders")
      .update({ 
        status: status as any,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;

    // Log status change as comment if notes provided
    if (notes) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.createWorkOrderComment({
          work_order_id: id,
          content: `Status changed to ${status}. ${notes}`,
        });
      }
    }

    return data;
  },
};
