
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersEnhancedApi } from "@/lib/database/work-orders-enhanced";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const useWorkOrderTemplates = () => {
  return useQuery({
    queryKey: ["work-order-templates"],
    queryFn: workOrdersEnhancedApi.getWorkOrderTemplates,
  });
};

export const useCreateWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      template: Tables["work_order_templates"]["Insert"];
      checklistItems?: Array<{ title: string; note?: string; order_index: number }>;
    }) => {
      // Create the template
      const template = await workOrdersEnhancedApi.createWorkOrderTemplate(data.template);
      
      // Create associated checklist items if provided
      if (data.checklistItems && data.checklistItems.length > 0) {
        const itemsToCreate = data.checklistItems.map(item => ({
          template_id: template.id,
          title: item.title,
          note: item.note,
          order_index: item.order_index,
        }));
        
        // Create all checklist items
        await Promise.all(
          itemsToCreate.map(item => 
            workOrdersEnhancedApi.createTemplateChecklistItem(item)
          )
        );
      }
      
      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Template created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create template");
      console.error("Create template error:", error);
    }
  });
};

export const useUpdateWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      updates: Tables["work_order_templates"]["Update"];
      checklistItems?: Array<{ id?: string; title: string; note?: string; order_index: number }>;
    }) => {
      // Update the template
      const template = await workOrdersEnhancedApi.updateWorkOrderTemplate(data.id, data.updates);
      
      // Handle checklist items if provided
      if (data.checklistItems) {
        // Get existing items
        const existingItems = await workOrdersEnhancedApi.getTemplateChecklistItems(data.id);
        const existingItemIds = existingItems.map(item => item.id);
        const updatedItemIds = data.checklistItems.filter(item => item.id).map(item => item.id!);
        
        // Delete items that are no longer in the list
        const itemsToDelete = existingItemIds.filter(id => !updatedItemIds.includes(id));
        await Promise.all(
          itemsToDelete.map(id => workOrdersEnhancedApi.deleteTemplateChecklistItem(id))
        );
        
        // Update or create items
        await Promise.all(
          data.checklistItems.map(item => {
            if (item.id) {
              // Update existing item
              return workOrdersEnhancedApi.updateTemplateChecklistItem(item.id, {
                title: item.title,
                note: item.note,
                order_index: item.order_index,
              });
            } else {
              // Create new item
              return workOrdersEnhancedApi.createTemplateChecklistItem({
                template_id: data.id,
                title: item.title,
                note: item.note,
                order_index: item.order_index,
              });
            }
          })
        );
      }
      
      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update template");
      console.error("Update template error:", error);
    }
  });
};

export const useDeleteWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get associated checklist items
      const checklistItems = await workOrdersEnhancedApi.getTemplateChecklistItems(id);
      
      // Delete all associated checklist items first
      await Promise.all(
        checklistItems.map(item => workOrdersEnhancedApi.deleteTemplateChecklistItem(item.id))
      );
      
      // Then delete the template
      await workOrdersEnhancedApi.deleteWorkOrderTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete template");
      console.error("Delete template error:", error);
    }
  });
};

export const useTemplateChecklistItems = (templateId: string) => {
  return useQuery({
    queryKey: ["template-checklist-items", templateId],
    queryFn: () => workOrdersEnhancedApi.getTemplateChecklistItems(templateId),
    enabled: !!templateId,
  });
};

export const useCreateWorkOrderFromTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createWorkOrderFromTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Work order created from template");
    },
    onError: (error) => {
      toast.error("Failed to create work order from template");
      console.error("Create from template error:", error);
    }
  });
};
