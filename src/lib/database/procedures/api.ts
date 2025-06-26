
import { supabase } from "@/integrations/supabase/client";
import { getCurrentTenantId } from "@/hooks/useInventoryHelpers";
import { ProcedureField, ProcedureWithFields, ProcedureExecution, ProcedureTemplate } from './types';
import { mapFieldFromDB, mapExecutionFromDB } from './utils';
import { getSampleTemplates } from './templates';

export const procedureApi = {
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
        order_index: field.order_index || index,
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

  // Update procedure with enhanced field handling
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
          order_index: field.order_index || index,
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

  // Save field values during execution
  async saveFieldValues(executionId: string, fieldValues: Record<string, any>): Promise<void> {
    console.log('Saving field values:', executionId, fieldValues);
    
    const { error } = await supabase
      .from("procedure_executions")
      .update({
        answers: fieldValues,
        updated_at: new Date().toISOString()
      })
      .eq("id", executionId);

    if (error) {
      console.error('Error saving field values:', error);
      throw error;
    }
  }
};
