import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCurrentTenantId } from "@/hooks/useInventoryHelpers";

type Tables = Database["public"]["Tables"];
type Procedure = Tables["procedures"]["Row"];
type ProcedureInsert = Tables["procedures"]["Insert"];
type ProcedureUpdate = Tables["procedures"]["Update"];

export interface ProcedureField {
  id?: string;
  procedure_id?: string;
  label: string;
  field_type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'multiselect' | 'file' | 'section';
  is_required: boolean;
  field_order: number;
  options?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ProcedureExecution {
  id?: string;
  procedure_id: string;
  work_order_id?: string;
  user_id?: string;
  tenant_id: string;
  answers: any;
  score?: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
}

export interface ProcedureTemplate {
  id?: string;
  tenant_id: string;
  name: string;
  description?: string;
  template_data: any;
  tags?: string[];
  is_public: boolean;
  created_by?: string;
}

export interface ProcedureWithFields extends Procedure {
  fields?: ProcedureField[];
  executions_count?: number;
}

const mapFieldFromDB = (dbField: any): ProcedureField => ({
  id: dbField.id,
  procedure_id: dbField.procedure_id,
  label: dbField.label,
  field_type: dbField.field_type as ProcedureField['field_type'],
  is_required: dbField.is_required || false,
  field_order: dbField.field_order || 0,
  options: dbField.options || {},
  created_at: dbField.created_at,
  updated_at: dbField.updated_at
});

export const proceduresEnhancedApi = {
  // Get all procedures with optional filters
  async getProcedures(params: {
    search?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ procedures: ProcedureWithFields[]; total: number }> {
    console.log('Fetching procedures with params:', params);
    
    let query = supabase
      .from("procedures")
      .select("*", { count: 'exact' });

    const tenantId = await getCurrentTenantId();
    query = query.eq("tenant_id", tenantId);

    // Apply filters
    if (params.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.category) {
      query = query.eq("category", params.category);
    }

    if (params.tags && params.tags.length > 0) {
      query = query.overlaps("tags", params.tags);
    }

    if (params.is_global !== undefined) {
      query = query.eq("is_global", params.is_global);
    }

    // Apply pagination
    if (params.limit) {
      const start = params.offset || 0;
      const end = start + params.limit - 1;
      query = query.range(start, end);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching procedures:', error);
      throw error;
    }

    // Get procedure fields for each procedure
    const proceduresWithFields = await Promise.all(
      (data || []).map(async (procedure) => {
        const { data: fields } = await supabase
          .from("procedure_fields")
          .select("*")
          .eq("procedure_id", procedure.id)
          .order("field_order");

        const { count: executionsCount } = await supabase
          .from("procedure_executions")
          .select("*", { count: 'exact', head: true })
          .eq("procedure_id", procedure.id);

        return {
          ...procedure,
          fields: (fields || []).map(mapFieldFromDB),
          executions_count: executionsCount || 0
        };
      })
    );

    return {
      procedures: proceduresWithFields,
      total: count || 0
    };
  },

  // Get single procedure with fields
  async getProcedure(id: string): Promise<ProcedureWithFields> {
    console.log('Fetching procedure:', id);
    
    const { data: procedure, error } = await supabase
      .from("procedures")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }

    const { data: fields } = await supabase
      .from("procedure_fields")
      .select("*")
      .eq("procedure_id", id)
      .order("field_order");

    const { count: executionsCount } = await supabase
      .from("procedure_executions")
      .select("*", { count: 'exact', head: true })
      .eq("procedure_id", id);

    return {
      ...procedure,
      fields: (fields || []).map(mapFieldFromDB),
      executions_count: executionsCount || 0
    };
  },

  // Create procedure with fields
  async createProcedure(procedure: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    fields: ProcedureField[];
  }): Promise<ProcedureWithFields> {
    console.log('Creating procedure:', procedure);
    
    const tenantId = await getCurrentTenantId();
    
    const { data: createdProcedure, error: procedureError } = await supabase
      .from("procedures")
      .insert({
        title: procedure.title,
        description: procedure.description || '',
        category: procedure.category || 'maintenance',
        tags: procedure.tags || [],
        is_global: procedure.is_global || false,
        tenant_id: tenantId
      })
      .select()
      .single();

    if (procedureError) {
      console.error('Error creating procedure:', procedureError);
      throw procedureError;
    }

    // Create fields
    if (procedure.fields.length > 0) {
      const fieldsToInsert = procedure.fields.map((field, index) => ({
        procedure_id: createdProcedure.id,
        label: field.label,
        field_type: field.field_type,
        is_required: field.is_required,
        field_order: field.field_order || index,
        options: field.options || {}
      }));

      const { data: fields, error: fieldsError } = await supabase
        .from("procedure_fields")
        .insert(fieldsToInsert)
        .select();

      if (fieldsError) {
        console.error('Error creating procedure fields:', fieldsError);
        throw fieldsError;
      }

      return { ...createdProcedure, fields: (fields || []).map(mapFieldFromDB) };
    }

    return { ...createdProcedure, fields: [] };
  },

  // Update procedure
  async updateProcedure(id: string, updates: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    fields?: ProcedureField[];
  }): Promise<ProcedureWithFields> {
    console.log('Updating procedure:', id, updates);
    
    const { data: updatedProcedure, error: procedureError } = await supabase
      .from("procedures")
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        tags: updates.tags,
        is_global: updates.is_global,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (procedureError) {
      console.error('Error updating procedure:', procedureError);
      throw procedureError;
    }

    // Update fields if provided
    if (updates.fields) {
      // Delete existing fields
      await supabase
        .from("procedure_fields")
        .delete()
        .eq("procedure_id", id);

      // Insert new fields
      if (updates.fields.length > 0) {
        const fieldsToInsert = updates.fields.map((field, index) => ({
          procedure_id: id,
          label: field.label,
          field_type: field.field_type,
          is_required: field.is_required,
          field_order: field.field_order || index,
          options: field.options || {}
        }));

        const { data: fields, error: fieldsError } = await supabase
          .from("procedure_fields")
          .insert(fieldsToInsert)
          .select();

        if (fieldsError) {
          console.error('Error updating procedure fields:', fieldsError);
          throw fieldsError;
        }

        return { ...updatedProcedure, fields: (fields || []).map(mapFieldFromDB) };
      }
    }

    // Get current fields
    const { data: fields } = await supabase
      .from("procedure_fields")
      .select("*")
      .eq("procedure_id", id)
      .order("field_order");

    return { ...updatedProcedure, fields: (fields || []).map(mapFieldFromDB) };
  },

  // Delete procedure
  async deleteProcedure(id: string): Promise<void> {
    console.log('Deleting procedure:', id);
    
    const { error } = await supabase
      .from("procedures")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },

  // Duplicate procedure
  async duplicateProcedure(id: string, newTitle?: string): Promise<ProcedureWithFields> {
    console.log('Duplicating procedure:', id);
    
    const original = await this.getProcedure(id);
    
    return await this.createProcedure({
      title: newTitle || `${original.title} (Copy)`,
      description: original.description,
      category: original.category,
      tags: original.tags,
      is_global: false, // Copies are never global
      fields: original.fields || []
    });
  },

  // Execute procedure
  async startExecution(procedureId: string, workOrderId?: string): Promise<ProcedureExecution> {
    console.log('Starting procedure execution:', procedureId);
    
    const tenantId = await getCurrentTenantId();
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .insert({
        procedure_id: procedureId,
        work_order_id: workOrderId,
        tenant_id: tenantId,
        status: 'in_progress',
        answers: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting execution:', error);
      throw error;
    }

    return data;
  },

  // Submit execution
  async submitExecution(executionId: string, answers: any, score?: number): Promise<ProcedureExecution> {
    console.log('Submitting execution:', executionId, answers);
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .update({
        answers,
        score: score || 0,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq("id", executionId)
      .select()
      .single();

    if (error) {
      console.error('Error submitting execution:', error);
      throw error;
    }

    return data;
  },

  // Get execution history
  async getExecutions(procedureId: string): Promise<ProcedureExecution[]> {
    console.log('Fetching executions for procedure:', procedureId);
    
    const { data, error } = await supabase
      .from("procedure_executions")
      .select(`
        *,
        users(email, first_name, last_name),
        work_orders(title)
      `)
      .eq("procedure_id", procedureId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching executions:', error);
      throw error;
    }

    return data || [];
  },

  // Templates
  async getTemplates(): Promise<ProcedureTemplate[]> {
    console.log('Fetching procedure templates');
    
    const tenantId = await getCurrentTenantId();
    
    const { data, error } = await supabase
      .from("procedure_templates")
      .select("*")
      .or(`tenant_id.eq.${tenantId},is_public.eq.true`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }

    return data || [];
  },

  async saveTemplate(template: {
    name: string;
    description?: string;
    template_data: any;
    tags?: string[];
    is_public?: boolean;
  }): Promise<ProcedureTemplate> {
    console.log('Saving template:', template);
    
    const tenantId = await getCurrentTenantId();
    
    const { data, error } = await supabase
      .from("procedure_templates")
      .insert({
        ...template,
        tenant_id: tenantId,
        is_public: template.is_public || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      throw error;
    }

    return data;
  },

  async deleteTemplate(id: string): Promise<void> {
    console.log('Deleting template:', id);
    
    const { error } = await supabase
      .from("procedure_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};
