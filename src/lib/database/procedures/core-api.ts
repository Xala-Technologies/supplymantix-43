
import { supabase } from "@/integrations/supabase/client";
import { ProcedureField } from './types';

export const coreApi = {
  getProcedures: async (params?: {
    search?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    try {
      console.log('Fetching procedures with filters:', params);
      
      // Get current user and tenant info with enhanced security checks
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('User authentication failed:', userError);
        throw new Error("User not authenticated");
      }

      const { data: userRecord, error: userRecordError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (userRecordError || !userRecord) {
        console.error('User record not found:', userRecordError);
        throw new Error("User record not found");
      }

      console.log('Authenticated user tenant:', userRecord.tenant_id);

      // Build query with strict tenant isolation
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
        .eq("tenant_id", userRecord.tenant_id); // CRITICAL: Always filter by tenant

      // Apply filters safely
      if (params?.search) {
        query = query.ilike("title", `%${params.search}%`);
      }
      
      if (params?.category) {
        query = query.eq("category", params.category);
      }
      
      if (params?.is_global !== undefined) {
        query = query.eq("is_global", params.is_global);
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      // Process data safely with null checks
      const processedData = (data || []).map((procedure: any) => ({
        ...procedure,
        fields: procedure.procedure_fields || [],
        executions_count: 0 // Default value
      }));

      console.log('Procedures fetched successfully:', processedData.length);
      
      return {
        procedures: processedData,
        total: count || processedData.length
      };
    } catch (error) {
      console.error('Error in getProcedures:', error);
      throw error;
    }
  },

  getProcedure: async (id: string) => {
    try {
      // Verify authentication and tenant
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("procedures")
        .select(`
          *,
          procedure_fields (*)
        `)
        .eq("id", id)
        .eq("tenant_id", userRecord.tenant_id) // CRITICAL: Tenant isolation
        .single();

      if (error) throw error;
      if (!data) throw new Error("Procedure not found");

      return {
        ...data,
        fields: data.procedure_fields || []
      };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  createProcedure: async (procedure: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    is_global?: boolean;
    fields?: Partial<ProcedureField>[];
  }) => {
    try {
      // Verify authentication
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Create procedure with tenant isolation
      const { data, error } = await supabase
        .from("procedures")
        .insert({
          ...procedure,
          tenant_id: userRecord.tenant_id,
          created_by: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create fields if provided
      if (procedure.fields && procedure.fields.length > 0) {
        const fieldsToInsert = procedure.fields.map((field, index) => ({
          procedure_id: data.id,
          tenant_id: userRecord.tenant_id, // Add missing tenant_id
          label: field.label || '',
          field_type: field.field_type || 'text',
          is_required: field.is_required || false,
          order_index: field.order_index !== undefined ? field.order_index : index,
          options: field.options || {}
        }));

        const { error: fieldsError } = await supabase
          .from("procedure_fields")
          .insert(fieldsToInsert);

        if (fieldsError) {
          console.error('Error creating procedure fields:', fieldsError);
          // Don't throw here to avoid leaving orphaned procedure
        }
      }

      return data;
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw error;
    }
  },

  updateProcedure: async (id: string, updates: any) => {
    try {
      // Verify authentication and ownership
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Update procedure with tenant check
      const { data, error } = await supabase
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
        .eq("tenant_id", userRecord.tenant_id) // CRITICAL: Tenant isolation
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Procedure not found or access denied");

      // Update fields if provided
      if (updates.fields) {
        console.log('Updating procedure fields:', updates.fields);
        
        // Delete existing fields
        await supabase
          .from("procedure_fields")
          .delete()
          .eq("procedure_id", id);

        // Insert new fields
        if (updates.fields.length > 0) {
          const fieldsToInsert = updates.fields.map((field: any, index: number) => ({
            procedure_id: id,
            tenant_id: userRecord.tenant_id, // Add missing tenant_id
            label: field.label || '',
            field_type: String(field.field_type || 'text'), // Ensure it's a string
            is_required: field.is_required || false,
            order_index: field.order_index !== undefined ? field.order_index : index,
            options: field.options || {}
          }));

          const { error: fieldsError } = await supabase
            .from("procedure_fields")
            .insert(fieldsToInsert);

          if (fieldsError) {
            console.error('Error updating procedure fields:', fieldsError);
            throw fieldsError;
          }
        }

        console.log('Procedure fields updated successfully');
      }

      return data;
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  deleteProcedure: async (id: string) => {
    try {
      // Verify authentication and ownership
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      // Delete with tenant check
      const { error } = await supabase
        .from("procedures")
        .delete()
        .eq("id", id)
        .eq("tenant_id", userRecord.tenant_id); // CRITICAL: Tenant isolation

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },

  duplicateProcedure: async (id: string, newTitle?: string) => {
    try {
      // Get original procedure
      const original = await coreApi.getProcedure(id);
      
      // Create duplicate
      const duplicate = await coreApi.createProcedure({
        title: newTitle || `${original.title} (Copy)`,
        description: original.description,
        category: original.category,
        tags: original.tags || [],
        is_global: false, // Duplicates are never global
        fields: original.fields || []
      });

      return duplicate;
    } catch (error) {
      console.error('Error duplicating procedure:', error);
      throw error;
    }
  }
};
