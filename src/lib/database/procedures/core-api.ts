
import { supabase } from '@/integrations/supabase/client';
import { CreateProcedureData, UpdateProcedureData, ProcedureFilters, ProcedureField, ProcedureFieldType } from './types';

export const coreApi = {
  // Get procedures with enhanced filtering
  getProcedures: async (filters: ProcedureFilters = {}) => {
    console.log('Fetching procedures with filters:', filters);
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    let query = supabase
      .from('procedures')
      .select(`
        *,
        procedure_fields (
          id,
          label,
          field_type,
          is_required,
          order_index,
          options,
          created_at,
          updated_at
        )
      `)
      .eq('tenant_id', userRecord.tenant_id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.is_global !== undefined) {
      query = query.eq('is_global', filters.is_global);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching procedures:', error);
      throw error;
    }

    // Transform the data to match expected format and add missing properties
    const procedures = data?.map(procedure => ({
      ...procedure,
      fields: (procedure.procedure_fields || []).map(field => ({
        ...field,
        procedure_id: procedure.id,
        field_type: field.field_type as ProcedureFieldType // Cast to proper type
      })) as ProcedureField[],
      executions_count: 0 // Add default executions_count
    })) || [];

    return {
      procedures,
      total: procedures.length
    };
  },

  // Get single procedure
  getProcedure: async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { data, error } = await supabase
      .from('procedures')
      .select(`
        *,
        procedure_fields (
          id,
          label,
          field_type,
          is_required,
          order_index,
          options,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .eq('tenant_id', userRecord.tenant_id)
      .single();

    if (error) throw error;

    return {
      ...data,
      fields: (data.procedure_fields || []).map(field => ({
        ...field,
        procedure_id: data.id,
        field_type: field.field_type as ProcedureFieldType // Cast to proper type
      })) as ProcedureField[],
      executions_count: 0 // Add default executions_count
    };
  },

  // Create procedure
  createProcedure: async (procedureData: CreateProcedureData) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { fields, ...procedureInfo } = procedureData;

    // Create the procedure first
    const { data: procedure, error: procedureError } = await supabase
      .from('procedures')
      .insert({
        ...procedureInfo,
        tenant_id: userRecord.tenant_id,
        created_by: userData.user.id
      })
      .select()
      .single();

    if (procedureError) throw procedureError;

    // Create fields if provided
    if (fields && fields.length > 0) {
      const fieldsToInsert = fields.map(field => ({
        ...field,
        procedure_id: procedure.id,
        tenant_id: userRecord.tenant_id
      }));

      const { error: fieldsError } = await supabase
        .from('procedure_fields')
        .insert(fieldsToInsert);

      if (fieldsError) {
        console.error('Error creating procedure fields:', fieldsError);
        // Don't throw here, procedure creation was successful
      }
    }

    return procedure;
  },

  // Update procedure
  updateProcedure: async (id: string, updates: UpdateProcedureData) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    const { fields, ...procedureUpdates } = updates;

    // Update the procedure
    const { data: procedure, error: procedureError } = await supabase
      .from('procedures')
      .update({
        ...procedureUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('tenant_id', userRecord.tenant_id)
      .select()
      .single();

    if (procedureError) throw procedureError;

    // Handle fields update if provided
    if (fields) {
      // Delete existing fields
      await supabase
        .from('procedure_fields')
        .delete()
        .eq('procedure_id', id);

      // Insert new fields
      if (fields.length > 0) {
        const fieldsToInsert = fields.map(field => ({
          ...field,
          procedure_id: id,
          tenant_id: userRecord.tenant_id
        }));

        const { error: fieldsError } = await supabase
          .from('procedure_fields')
          .insert(fieldsToInsert);

        if (fieldsError) {
          console.error('Error updating procedure fields:', fieldsError);
        }
      }
    }

    return procedure;
  },

  // Delete procedure
  deleteProcedure: async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();

    if (!userRecord) throw new Error("User record not found");

    // Delete procedure fields first
    await supabase
      .from('procedure_fields')
      .delete()
      .eq('procedure_id', id);

    // Delete the procedure
    const { error } = await supabase
      .from('procedures')
      .delete()
      .eq('id', id)
      .eq('tenant_id', userRecord.tenant_id);

    if (error) throw error;
  },

  // Duplicate procedure
  duplicateProcedure: async (id: string, newTitle?: string) => {
    const original = await coreApi.getProcedure(id);
    
    const duplicateData = {
      ...original,
      title: newTitle || `${original.title} (Copy)`,
      created_at: undefined,
      updated_at: undefined,
      id: undefined
    };

    return coreApi.createProcedure(duplicateData);
  }
};
