
import { supabase } from "@/integrations/supabase/client";
import type { Procedure, ProcedureInsert, ProcedureUpdate, ProcedureFieldType } from "./types";

export const coreApi = {
  // Get procedures with optional filters
  getProcedures: async (params?: {
    search?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    console.log('API: Getting procedures with params:', params);
    
    try {
      // Get current user and tenant info
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData.user?.id);
      
      if (!userData.user) {
        console.error('No authenticated user found');
        throw new Error("User not authenticated");
      }

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      console.log('User tenant_id:', userRecord?.tenant_id);

      if (!userRecord) {
        console.error('User record not found');
        throw new Error("User record not found");
      }

      // Build the query
      let query = supabase
        .from("procedures")
        .select(`
          *,
          procedure_fields (
            id,
            procedure_id,
            label,
            field_type,
            is_required,
            order_index,
            options,
            created_at,
            updated_at
          )
        `)
        .eq("tenant_id", userRecord.tenant_id);

      // Apply filters
      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      if (params?.category) {
        query = query.eq("category", params.category);
      }

      if (params?.is_global !== undefined) {
        query = query.eq("is_global", params.is_global);
      }

      if (params?.tags && params.tags.length > 0) {
        query = query.contains("tags", params.tags);
      }

      // Apply pagination
      if (params?.limit) {
        query = query.limit(params.limit);
      }

      if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
      }

      // Order by created_at descending
      query = query.order("created_at", { ascending: false });

      console.log('Executing query...');
      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Query successful. Found procedures:', data?.length || 0);
      
      // Transform the data to match expected format
      const procedures = (data || []).map(procedure => ({
        ...procedure,
        asset_ids: procedure.asset_ids || [],
        location_ids: procedure.location_ids || [],
        team_ids: procedure.team_ids || [],
        fields: (procedure.procedure_fields || []).map(field => ({
          ...field,
          field_type: field.field_type as ProcedureFieldType,
          procedure_id: field.procedure_id || procedure.id,
          created_at: field.created_at || new Date().toISOString(),
          updated_at: field.updated_at || new Date().toISOString(),
          options: (field.options as any) || {}
        })),
        executions_count: 0 // TODO: Add actual count from procedure_executions
      }));

      return {
        procedures,
        total: count || procedures.length
      };
    } catch (error) {
      console.error('Error in getProcedures:', error);
      throw error;
    }
  },

  // Get a single procedure by ID
  getProcedure: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("procedures")
        .select(`
          *,
          procedure_fields (
            id,
            procedure_id,
            label,
            field_type,
            is_required,
            order_index,
            options,
            created_at,
            updated_at
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        ...data,
        asset_ids: data.asset_ids || [],
        location_ids: data.location_ids || [],
        team_ids: data.team_ids || [],
        template_data: data.template_data as any,
        steps: data.steps as any,
        fields: (data.procedure_fields || []).map(field => ({
          ...field,
          field_type: field.field_type as ProcedureFieldType,
          procedure_id: field.procedure_id || data.id,
          created_at: field.created_at || new Date().toISOString(),
          updated_at: field.updated_at || new Date().toISOString(),
          options: (field.options as any) || {}
        })),
        executions_count: 0 // TODO: Add actual count from procedure_executions
      };
    } catch (error) {
      console.error("Error fetching procedure:", error);
      throw error;
    }
  },

  // Create a new procedure
  createProcedure: async (procedure: ProcedureInsert) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Separate fields from procedure data
      const { fields, ...procedureData } = procedure;

      const { data, error } = await supabase
        .from("procedures")
        .insert({ 
          ...procedureData, 
          tenant_id: userRecord.tenant_id,
          asset_ids: procedureData.asset_ids || [],
          location_ids: procedureData.location_ids || [],
          team_ids: procedureData.team_ids || []
        })
        .select()
        .single();

      if (error) throw error;

      // Insert fields if provided
      if (fields && fields.length > 0) {
        const fieldsToInsert = fields.map(field => ({
          ...field,
          procedure_id: data.id,
        }));

        const { error: fieldsError } = await supabase
          .from("procedure_fields")
          .insert(fieldsToInsert);

        if (fieldsError) throw fieldsError;
      }

      return data;
    } catch (error) {
      console.error("Error creating procedure:", error);
      throw error;
    }
  },

  // Update an existing procedure
  updateProcedure: async (id: string, updates: ProcedureUpdate) => {
    try {
      const { data, error } = await supabase
        .from("procedures")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating procedure:", error);
      throw error;
    }
  },

  // Delete a procedure
  deleteProcedure: async (id: string) => {
    try {
      const { error } = await supabase
        .from("procedures")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting procedure:", error);
      throw error;
    }
  },

  // Duplicate a procedure
  duplicateProcedure: async (id: string, newTitle?: string) => {
    try {
      // Fetch the original procedure
      const originalProcedure = await coreApi.getProcedure(id);

      if (!originalProcedure) {
        throw new Error("Procedure not found");
      }

      // Prepare the new procedure data
      const { fields, ...procedureData } = originalProcedure;
      delete (procedureData as any).id; // Remove the original ID

      const newProcedure: ProcedureInsert = {
        ...procedureData,
        title: newTitle || `Copy of ${procedureData.title}`,
        fields: fields || [],
      };

      // Create the new procedure
      const createdProcedure = await coreApi.createProcedure(newProcedure);

      if (!createdProcedure?.id) {
        throw new Error("Failed to create duplicate procedure");
      }

      // Return the new procedure
      return coreApi.getProcedure(createdProcedure.id);
    } catch (error) {
      console.error("Error duplicating procedure:", error);
      throw error;
    }
  },
};
