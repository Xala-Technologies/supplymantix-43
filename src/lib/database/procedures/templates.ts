
import { supabase } from "@/integrations/supabase/client";
import { getCurrentTenantId } from "@/hooks/useInventoryHelpers";
import { ProcedureTemplate } from './types';

export const getSampleTemplates = (): Omit<ProcedureTemplate, 'id' | 'tenant_id' | 'created_by'>[] => [
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

export const templateApi = {
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
