
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
        field_type: field.field_type as ProcedureFieldType
      })) as ProcedureField[],
      executions_count: 0
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
        field_type: field.field_type as ProcedureFieldType
      })) as ProcedureField[],
      executions_count: 0
    };
  },

  // Create procedure
  createProcedure: async (procedureData: CreateProcedureData) => {
    console.log('Creating procedure with data:', procedureData);

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
        created_by: userData.user.id,
        tags: procedureInfo.tags || [],
        is_global: procedureInfo.is_global || false,
        category: procedureInfo.category || 'Inspection'
      })
      .select()
      .single();

    if (procedureError) {
      console.error('Error creating procedure:', procedureError);
      throw procedureError;
    }

    console.log('Procedure created successfully:', procedure);

    // Create fields if provided
    if (fields && fields.length > 0) {
      const fieldsToInsert = fields.map((field, index) => ({
        label: field.label,
        field_type: field.field_type,
        is_required: field.is_required || false,
        order_index: field.order_index !== undefined ? field.order_index : index,
        options: field.options || {},
        procedure_id: procedure.id,
        tenant_id: userRecord.tenant_id
      }));

      console.log('Creating procedure fields:', fieldsToInsert);

      const { error: fieldsError } = await supabase
        .from('procedure_fields')
        .insert(fieldsToInsert);

      if (fieldsError) {
        console.error('Error creating procedure fields:', fieldsError);
        throw fieldsError;
      }

      console.log('Procedure fields created successfully');
    }

    return procedure;
  },

  // Update procedure
  updateProcedure: async (id: string, updates: UpdateProcedureData) => {
    console.log('Updating procedure:', id, updates);

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

    if (procedureError) {
      console.error('Error updating procedure:', procedureError);
      throw procedureError;
    }

    // Handle fields update if provided
    if (fields !== undefined) {
      console.log('Updating procedure fields:', fields);
      
      // Delete existing fields
      const { error: deleteError } = await supabase
        .from('procedure_fields')
        .delete()
        .eq('procedure_id', id);

      if (deleteError) {
        console.error('Error deleting existing fields:', deleteError);
        throw deleteError;
      }

      // Insert new fields
      if (fields.length > 0) {
        const fieldsToInsert = fields.map((field, index) => ({
          label: field.label,
          field_type: field.field_type,
          is_required: field.is_required || false,
          order_index: field.order_index !== undefined ? field.order_index : index,
          options: field.options || {},
          procedure_id: id,
          tenant_id: userRecord.tenant_id
        }));

        const { error: fieldsError } = await supabase
          .from('procedure_fields')
          .insert(fieldsToInsert);

        if (fieldsError) {
          console.error('Error inserting new fields:', fieldsError);
          throw fieldsError;
        }
      }

      console.log('Procedure fields updated successfully');
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
    console.log('Duplicating procedure:', id);
    
    const original = await coreApi.getProcedure(id);
    
    // Transform fields to the format expected by createProcedure
    const transformedFields = original.fields?.map(field => ({
      label: field.label,
      field_type: field.field_type,
      is_required: field.is_required,
      order_index: field.order_index,
      options: field.options || {}
    })) || [];

    const duplicateData: CreateProcedureData = {
      title: newTitle || `${original.title} (Copy)`,
      description: original.description,
      asset_type: original.asset_type,
      category: original.category,
      tags: original.tags,
      is_global: false, // Duplicates are not global by default
      template_data: original.template_data,
      steps: original.steps,
      estimated_duration: original.estimated_duration,
      asset_ids: original.asset_ids,
      location_ids: original.location_ids,
      team_ids: original.team_ids,
      fields: transformedFields
    };

    console.log('Creating duplicate with data:', duplicateData);
    return coreApi.createProcedure(duplicateData);
  }
};
