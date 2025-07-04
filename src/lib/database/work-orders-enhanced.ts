import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { workOrdersApi } from "./work-orders";
import { WorkOrder } from "@/features/workOrders/types";

type Tables = Database["public"]["Tables"];

export const workOrdersEnhancedApi = {
  // Extended work order creation with assignments and procedures
  async createWorkOrderWithRelations(workOrderData: {
    workOrder: Tables["work_orders"]["Insert"];
    assignments?: Array<{ user_id: string; role?: string }>;
    procedures?: Array<{ procedure_id: string }>;
    parts?: Array<{ inventory_item_id?: string; part_name: string; quantity: number; unit_cost?: number }>;
  }) {
    console.log('Creating work order with relations:', workOrderData);
    
    const { data: workOrder, error: woError } = await supabase
      .from("work_orders")
      .insert(workOrderData.workOrder)
      .select()
      .single();
    
    if (woError) {
      console.error('Error creating work order:', woError);
      throw woError;
    }

    // Create assignments
    if (workOrderData.assignments && workOrderData.assignments.length > 0) {
      const assignments = workOrderData.assignments.map(assignment => ({
        work_order_id: workOrder.id,
        user_id: assignment.user_id,
        role: assignment.role || 'assignee',
        tenant_id: workOrder.tenant_id
      }));

      const { error: assignError } = await supabase
        .from("work_order_assignments")
        .insert(assignments);

      if (assignError) {
        console.error('Error creating assignments:', assignError);
      }
    }

    // Create procedure relations
    if (workOrderData.procedures && workOrderData.procedures.length > 0) {
      const procedures = workOrderData.procedures.map(proc => ({
        work_order_id: workOrder.id,
        procedure_id: proc.procedure_id,
        tenant_id: workOrder.tenant_id
      }));

      const { error: procError } = await supabase
        .from("work_order_procedures")
        .insert(procedures);

      if (procError) {
        console.error('Error creating procedure relations:', procError);
      }
    }

    // Create parts usage records
    if (workOrderData.parts && workOrderData.parts.length > 0) {
      const parts = workOrderData.parts.map(part => ({
        work_order_id: workOrder.id,
        inventory_item_id: part.inventory_item_id,
        part_name: part.part_name,
        quantity: part.quantity,
        unit_cost: part.unit_cost,
        total_cost: part.unit_cost ? part.unit_cost * part.quantity : null,
        tenant_id: workOrder.tenant_id
      }));

      const { error: partsError } = await supabase
        .from("work_order_parts_used")
        .insert(parts);

      if (partsError) {
        console.error('Error creating parts usage:', partsError);
      }
    }

    return workOrder;
  },

  // Get work order with all related data
  async getWorkOrderWithRelations(workOrderId: string) {
    console.log('Fetching work order with relations:', workOrderId);
    
    const { data, error } = await supabase
      .from("work_orders")
      .select(`
        *,
        asset:assets(id, name, location),
        assigned_user:users!work_orders_assigned_to_fkey(id, email, first_name, last_name),
        location:locations(id, name),
        assignments:work_order_assignments(
          id,
          role,
          assigned_at,
          user:users(id, email, first_name, last_name)
        ),
        procedures:work_order_procedures(
          id,
          status,
          started_at,
          completed_at,
          notes,
          procedure:procedures(id, title, description)
        ),
        parts_used:work_order_parts_used(
          id,
          part_name,
          quantity,
          unit_cost,
          total_cost,
          used_at,
          notes
        ),
        status_history:work_order_status_history(
          id,
          old_status,
          new_status,
          changed_at,
          notes,
          user:users(email, first_name, last_name)
        ),
        sub_orders:work_orders!work_orders_parent_id_fkey(
          id,
          title,
          status,
          priority,
          due_date
        )
      `)
      .eq("id", workOrderId)
      .single();

    if (error) {
      console.error('Error fetching work order with relations:', error);
      throw error;
    }

    return data;
  },

  // Update work order assignments
  async updateWorkOrderAssignments(workOrderId: string, assignments: Array<{ user_id: string; role?: string }>) {
    console.log('Updating work order assignments:', workOrderId, assignments);
    
    // Get current tenant_id
    const { data: woData } = await supabase
      .from("work_orders")
      .select("tenant_id")
      .eq("id", workOrderId)
      .single();

    if (!woData) throw new Error("Work order not found");

    // Remove existing assignments
    await supabase
      .from("work_order_assignments")
      .delete()
      .eq("work_order_id", workOrderId);

    // Add new assignments
    if (assignments.length > 0) {
      const assignmentData = assignments.map(assignment => ({
        work_order_id: workOrderId,
        user_id: assignment.user_id,
        role: assignment.role || 'assignee',
        tenant_id: woData.tenant_id
      }));

      const { error } = await supabase
        .from("work_order_assignments")
        .insert(assignmentData);

      if (error) {
        console.error('Error updating assignments:', error);
        throw error;
      }
    }
  },

  // Add procedure to work order
  async addProcedureToWorkOrder(workOrderId: string, procedureId: string) {
    console.log('Adding procedure to work order:', workOrderId, procedureId);
    
    const { data: woData } = await supabase
      .from("work_orders")
      .select("tenant_id")
      .eq("id", workOrderId)
      .single();

    if (!woData) throw new Error("Work order not found");

    const { data, error } = await supabase
      .from("work_order_procedures")
      .insert({
        work_order_id: workOrderId,
        procedure_id: procedureId,
        tenant_id: woData.tenant_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding procedure:', error);
      throw error;
    }

    return data;
  },

  // Update procedure status
  async updateProcedureStatus(workOrderProcedureId: string, status: 'pending' | 'in_progress' | 'completed' | 'skipped', notes?: string) {
    console.log('Updating procedure status:', workOrderProcedureId, status);
    
    const updates: any = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from("work_order_procedures")
      .update(updates)
      .eq("id", workOrderProcedureId)
      .select()
      .single();

    if (error) {
      console.error('Error updating procedure status:', error);
      throw error;
    }

    return data;
  },

  // Record parts usage
  async recordPartsUsage(workOrderId: string, parts: Array<{
    inventory_item_id?: string;
    part_name: string;
    quantity: number;
    unit_cost?: number;
    notes?: string;
  }>) {
    console.log('Recording parts usage:', workOrderId, parts);
    
    const { data: woData } = await supabase
      .from("work_orders")
      .select("tenant_id")
      .eq("id", workOrderId)
      .single();

    if (!woData) throw new Error("Work order not found");

    const partsData = parts.map(part => ({
      work_order_id: workOrderId,
      inventory_item_id: part.inventory_item_id,
      part_name: part.part_name,
      quantity: part.quantity,
      unit_cost: part.unit_cost,
      total_cost: part.unit_cost ? part.unit_cost * part.quantity : null,
      notes: part.notes,
      tenant_id: woData.tenant_id
    }));

    const { data, error } = await supabase
      .from("work_order_parts_used")
      .insert(partsData)
      .select();

    if (error) {
      console.error('Error recording parts usage:', error);
      throw error;
    }

    return data;
  },

  // Create sub work order
  async createSubWorkOrder(parentId: string, subWorkOrderData: Tables["work_orders"]["Insert"]) {
    console.log('Creating sub work order:', parentId, subWorkOrderData);
    
    const dataWithParent = {
      ...subWorkOrderData,
      parent_id: parentId
    };

    return await workOrdersApi.createWorkOrder(dataWithParent);
  },

  // Get work orders with advanced filtering
  async getWorkOrdersWithFilters(filters: {
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    dateRange?: { from: string; to: string };
    search?: string;
    parentId?: string;
    includeSubOrders?: boolean;
  }) {
    console.log('Fetching work orders with filters:', filters);
    
    // Get user's tenant_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User not authenticated');

    const { data: userData } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!userData) throw new Error('User data not found');

    let query = supabase
      .from("work_orders")
      .select(`
        *,
        asset:assets(id, name, location),
        assigned_user:users!work_orders_assigned_to_fkey(id, email, first_name, last_name),
        location:locations(id, name),
        assignments:work_order_assignments(
          id,
          role,
          user:users(id, email, first_name, last_name)
        )
      `)
      .eq("tenant_id", userData.tenant_id);

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      query = query.in("status", filters.status as any);
    }

    if (filters.priority && filters.priority.length > 0) {
      query = query.in("priority", filters.priority as any);
    }

    if (filters.dateRange) {
      query = query
        .gte("due_date", filters.dateRange.from)
        .lte("due_date", filters.dateRange.to);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.parentId !== undefined) {
      if (filters.parentId === null) {
        // Get only root work orders
        query = query.is("parent_id", null);
      } else {
        // Get children of specific parent
        query = query.eq("parent_id", filters.parentId);
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching filtered work orders:', error);
      throw error;
    }

    return data || [];
  },

  // Get work order status history
  async getWorkOrderStatusHistory(workOrderId: string) {
    console.log('Fetching work order status history:', workOrderId);
    
    const { data, error } = await supabase
      .from("work_order_status_history")
      .select(`
        *,
        user:users(email, first_name, last_name)
      `)
      .eq("work_order_id", workOrderId)
      .order("changed_at", { ascending: false });

    if (error) {
      console.error('Error fetching status history:', error);
      throw error;
    }

    return data || [];
  },

  // Get dashboard metrics
  async getDashboardMetrics() {
    console.log('Fetching work order dashboard metrics');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!userData) throw new Error('User data not found');

    // Get work orders for metrics calculation
    const { data: workOrders } = await supabase
      .from("work_orders")
      .select("status, priority, due_date, completed_at, created_at")
      .eq("tenant_id", userData.tenant_id);

    if (!workOrders) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const metrics = {
      total: workOrders.length,
      open: workOrders.filter(wo => wo.status === 'open').length,
      in_progress: workOrders.filter(wo => wo.status === 'in_progress').length,
      completed: workOrders.filter(wo => wo.status === 'completed').length,
      overdue: workOrders.filter(wo => 
        wo.due_date && 
        new Date(wo.due_date) < now && 
        wo.status !== 'completed'
      ).length,
      completed_last_month: workOrders.filter(wo => 
        wo.completed_at && 
        new Date(wo.completed_at) >= thirtyDaysAgo
      ).length,
      high_priority: workOrders.filter(wo => wo.priority === 'high' || wo.priority === 'urgent').length,
    };

    return metrics;
  },

  // Work Order Templates
  async getWorkOrderTemplates() {
    console.log('Fetching work order templates');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: userData } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!userData) throw new Error('User data not found');

    const { data, error } = await supabase
      .from("work_order_templates")
      .select("*")
      .eq("tenant_id", userData.tenant_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching work order templates:', error);
      throw error;
    }

    return data || [];
  },

  async createWorkOrderTemplate(template: Tables["work_order_templates"]["Insert"]) {
    console.log('Creating work order template:', template);
    
    const { data, error } = await supabase
      .from("work_order_templates")
      .insert(template)
      .select()
      .single();

    if (error) {
      console.error('Error creating work order template:', error);
      throw error;
    }

    return data;
  },

  async updateWorkOrderTemplate(id: string, updates: Tables["work_order_templates"]["Update"]) {
    console.log('Updating work order template:', id, updates);
    
    const { data, error } = await supabase
      .from("work_order_templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating work order template:', error);
      throw error;
    }

    return data;
  },

  async deleteWorkOrderTemplate(id: string) {
    console.log('Deleting work order template:', id);
    
    const { error } = await supabase
      .from("work_order_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('Error deleting work order template:', error);
      throw error;
    }
  },

  async createWorkOrderFromTemplate(templateId: string, overrides: Partial<Tables["work_orders"]["Insert"]> = {}) {
    console.log('Creating work order from template:', templateId, overrides);
    
    const { data: template, error: templateError } = await supabase
      .from("work_order_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    const workOrderData = {
      title: template.title,
      description: template.description,
      priority: template.priority,
      tags: template.default_tags,
      assigned_to: template.default_assignee,
      tenant_id: template.tenant_id,
      template_id: templateId,
      ...overrides
    };

    return await workOrdersApi.createWorkOrder(workOrderData);
  },

  // Checklist Items
  async getChecklistItems(workOrderId: string) {
    console.log('Fetching checklist items for work order:', workOrderId);
    
    const { data, error } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("work_order_id", workOrderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error('Error fetching checklist items:', error);
      throw error;
    }

    return data || [];
  },

  async createChecklistItem(item: Tables["checklist_items"]["Insert"]) {
    console.log('Creating checklist item:', item);
    
    const { data, error } = await supabase
      .from("checklist_items")
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating checklist item:', error);
      throw error;
    }

    return data;
  },

  async updateChecklistItem(id: string, updates: Tables["checklist_items"]["Update"]) {
    console.log('Updating checklist item:', id, updates);
    
    const { data, error } = await supabase
      .from("checklist_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating checklist item:', error);
      throw error;
    }

    return data;
  },

  async deleteChecklistItem(id: string) {
    console.log('Deleting checklist item:', id);
    
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('Error deleting checklist item:', error);
      throw error;
    }
  },

  // Template Checklist Items - Simplified for now (table doesn't exist yet)
  async getTemplateChecklistItems(templateId: string) {
    console.log('Fetching template checklist items:', templateId);
    // Return empty array for now since table doesn't exist
    return [];
  },

  async createTemplateChecklistItem(item: any) {
    console.log('Creating template checklist item:', item);
    // Return mock data for now
    return { id: 'temp-id', ...item };
  },

  async updateTemplateChecklistItem(id: string, updates: any) {
    console.log('Updating template checklist item:', id, updates);
    // Return mock data for now
    return { id, ...updates };
  },

  async deleteTemplateChecklistItem(id: string) {
    console.log('Deleting template checklist item:', id);
    // No-op for now
  },

  // Time Logs
  async getTimeLogs(workOrderId: string) {
    console.log('Fetching time logs for work order:', workOrderId);
    
    const { data, error } = await supabase
      .from("time_logs")
      .select(`
        *,
        user:users(email, first_name, last_name)
      `)
      .eq("work_order_id", workOrderId)
      .order("logged_at", { ascending: false });

    if (error) {
      console.error('Error fetching time logs:', error);
      throw error;
    }

    return data || [];
  },

  async createTimeLog(timeLog: Tables["time_logs"]["Insert"]) {
    console.log('Creating time log:', timeLog);
    
    const { data, error } = await supabase
      .from("time_logs")
      .insert(timeLog)
      .select()
      .single();

    if (error) {
      console.error('Error creating time log:', error);
      throw error;
    }

    return data;
  },

  // Cost Entries - Simplified (table doesn't exist yet)
  async getCostEntries(workOrderId: string) {
    console.log('Fetching cost entries for work order:', workOrderId);
    // Return empty array for now since table doesn't exist
    return [];
  },

  async createCostEntry(costEntry: any) {
    console.log('Creating cost entry:', costEntry);
    // Return mock data for now
    return { id: 'temp-id', ...costEntry };
  },

  // Work Order Comments
  async getWorkOrderComments(workOrderId: string) {
    return await workOrdersApi.getChatMessages(workOrderId);
  },

  async createWorkOrderComment(comment: any) {
    return await workOrdersApi.createChatMessage(comment);
  },

  // Work Order Attachments 
  async getWorkOrderAttachments(workOrderId: string) {
    console.log('Fetching work order attachments:', workOrderId);
    // Return empty array for now - this can be implemented later
    return [];
  },

  async createAttachment(attachment: any) {
    console.log('Creating attachment:', attachment);
    // Return mock data for now
    return { id: 'temp-id', ...attachment };
  },

  // Status update method to match hooks expectations
  async updateWorkOrderStatus(id: string, status: string, notes?: string) {
    return await workOrdersApi.updateWorkOrder(id, { 
      status: status as any,
      updated_at: new Date().toISOString()
    });
  }
};