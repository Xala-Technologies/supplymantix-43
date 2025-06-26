import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCurrentTenantId } from "@/hooks/useInventoryHelpers";

type Tables = Database["public"]["Tables"];
type Procedure = Tables["procedures"]["Row"];
type ProcedureInsert = Tables["procedures"]["Insert"];
type ProcedureUpdate = Tables["procedures"]["Update"];

export type ProcedureFieldType = 
  | 'text'
  | 'textarea' 
  | 'number'
  | 'email'
  | 'url'
  | 'phone'
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'rating'
  | 'slider'
  | 'section'
  | 'divider'
  | 'info';

export interface ProcedureField {
  id: string;
  procedure_id: string;
  field_type: ProcedureFieldType;
  label: string;
  is_required: boolean;
  order_index: number;
  options?: {
    choices?: string[];
    placeholder?: string;
    helpText?: string;
    defaultValue?: string | number;
    minValue?: number;
    maxValue?: number;
    step?: number;
    minRating?: number;
    maxRating?: number;
    points?: number;
    infoText?: string;
    allowMultiple?: boolean;
    maxFileSize?: number;
    acceptedFileTypes?: string[];
  };
  created_at: string;
  updated_at: string;
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

// Sample templates data
const getSampleTemplates = (): Omit<ProcedureTemplate, 'id' | 'tenant_id' | 'created_by'>[] => [
  {
    name: "Equipment Safety Inspection",
    description: "Standard safety inspection checklist for industrial equipment",
    is_public: true,
    tags: ["safety", "inspection", "equipment"],
    template_data: {
      title: "Equipment Safety Inspection",
      description: "Comprehensive safety inspection for industrial equipment",
      category: "Safety",
      fields: [
        {
          label: "Equipment ID",
          field_type: "text",
          is_required: true,
          order_index: 0,
          options: {}
        },
        {
          label: "Inspector Name",
          field_type: "text",
          is_required: true,
          order_index: 1,
          options: {}
        },
        {
          label: "Visual Inspection Complete",
          field_type: "checkbox",
          is_required: true,
          order_index: 2,
          options: {}
        },
        {
          label: "Safety Guards in Place",
          field_type: "select",
          is_required: true,
          order_index: 3,
          options: {
            choices: ["Yes - All Present", "Partial - Some Missing", "No - None Present"]
          }
        },
        {
          label: "Issues Found",
          field_type: "multiselect",
          is_required: false,
          order_index: 4,
          options: {
            choices: ["Loose bolts", "Worn belts", "Oil leaks", "Unusual noises", "Vibration", "Other"]
          }
        },
        {
          label: "Additional Notes",
          field_type: "text",
          is_required: false,
          order_index: 5,
          options: {}
        }
      ]
    }
  },
  {
    name: "HVAC Maintenance Checklist",
    description: "Monthly HVAC system maintenance and inspection procedure",
    is_public: true,
    tags: ["maintenance", "hvac", "monthly"],
    template_data: {
      title: "HVAC Monthly Maintenance",
      description: "Regular maintenance checklist for HVAC systems",
      category: "Preventive Maintenance",
      fields: [
        {
          label: "System Location",
          field_type: "text",
          is_required: true,
          order_index: 0,
          options: {}
        },
        {
          label: "Filter Condition",
          field_type: "select",
          is_required: true,
          order_index: 1,
          options: {
            choices: ["Clean", "Dirty - Cleaned", "Replaced", "Needs Replacement"]
          }
        },
        {
          label: "Temperature Reading (°F)",
          field_type: "number",
          is_required: true,
          order_index: 2,
          options: {}
        },
        {
          label: "Belt Tension Check",
          field_type: "checkbox",
          is_required: true,
          order_index: 3,
          options: {}
        },
        {
          label: "Lubrication Points Serviced",
          field_type: "checkbox",
          is_required: true,
          order_index: 4,
          options: {}
        },
        {
          label: "System Performance",
          field_type: "select",
          is_required: true,
          order_index: 5,
          options: {
            choices: ["Excellent", "Good", "Fair", "Poor - Needs Attention"]
          }
        }
      ]
    }
  },
  {
    name: "Quality Control Inspection",
    description: "Product quality control and verification checklist",
    is_public: true,
    tags: ["quality", "inspection", "product"],
    template_data: {
      title: "Quality Control Inspection",
      description: "Standard quality control inspection for manufactured products",
      category: "Quality Control",
      fields: [
        {
          label: "Product/Batch Number",
          field_type: "text",
          is_required: true,
          order_index: 0,
          options: {}
        },
        {
          label: "Inspector Badge Number",
          field_type: "text",
          is_required: true,
          order_index: 1,
          options: {}
        },
        {
          label: "Inspection Date",
          field_type: "date",
          is_required: true,
          order_index: 2,
          options: {}
        },
        {
          label: "Dimensional Check Pass",
          field_type: "checkbox",
          is_required: true,
          order_index: 3,
          options: {}
        },
        {
          label: "Surface Finish Quality",
          field_type: "select",
          is_required: true,
          order_index: 4,
          options: {
            choices: ["Excellent", "Good", "Acceptable", "Reject"]
          }
        },
        {
          label: "Defects Found",
          field_type: "multiselect",
          is_required: false,
          order_index: 5,
          options: {
            choices: ["Scratches", "Dents", "Color variation", "Incomplete assembly", "Missing parts"]
          }
        },
        {
          label: "Overall Result",
          field_type: "select",
          is_required: true,
          order_index: 6,
          options: {
            choices: ["Pass", "Pass with Notes", "Conditional Pass", "Reject"]
          }
        }
      ]
    }
  }
];

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

    return mapExecutionFromDB(data);
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

    return mapExecutionFromDB(data);
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

    return (data || []).map(mapExecutionFromDB);
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

    // If no templates exist, create sample templates
    if (!data || data.length === 0) {
      console.log('No templates found, creating sample templates...');
      await this.createSampleTemplates();
      
      // Fetch again after creating samples
      const { data: newData, error: newError } = await supabase
        .from("procedure_templates")
        .select("*")
        .or(`tenant_id.eq.${tenantId},is_public.eq.true`)
        .order("created_at", { ascending: false });

      if (newError) {
        console.error('Error fetching templates after creating samples:', newError);
        throw newError;
      }

      return newData || [];
    }

    return data || [];
  },

  async createSampleTemplates(): Promise<void> {
    console.log('Creating sample templates...');
    
    const tenantId = await getCurrentTenantId();
    const sampleTemplates = getSampleTemplates();
    
    const templatesToInsert = sampleTemplates.map(template => ({
      ...template,
      tenant_id: tenantId
    }));

    const { error } = await supabase
      .from("procedure_templates")
      .insert(templatesToInsert);

    if (error) {
      console.error('Error creating sample templates:', error);
      throw error;
    }

    console.log('Sample templates created successfully');
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

const mapFieldFromDB = (dbField: any): ProcedureField => ({
  id: dbField.id,
  procedure_id: dbField.procedure_id,
  label: dbField.label,
  field_type: dbField.field_type as ProcedureField['field_type'],
  is_required: dbField.is_required || false,
  order_index: dbField.field_order || 0,
  options: dbField.options || {},
  created_at: dbField.created_at,
  updated_at: dbField.updated_at
});

const mapExecutionFromDB = (dbExecution: any): ProcedureExecution => ({
  id: dbExecution.id,
  procedure_id: dbExecution.procedure_id,
  work_order_id: dbExecution.work_order_id,
  user_id: dbExecution.user_id,
  tenant_id: dbExecution.tenant_id,
  answers: dbExecution.answers,
  score: dbExecution.score,
  status: dbExecution.status as ProcedureExecution['status'],
  started_at: dbExecution.started_at,
  completed_at: dbExecution.completed_at
});
