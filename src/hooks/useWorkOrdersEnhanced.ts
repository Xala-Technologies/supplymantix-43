
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersEnhancedApi } from "@/lib/database/work-orders-enhanced";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

// Work Order Templates
export const useWorkOrderTemplates = () => {
  return useQuery({
    queryKey: ["work-order-templates"],
    queryFn: workOrdersEnhancedApi.getWorkOrderTemplates,
  });
};

export const useCreateWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createWorkOrderTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Work order template created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create work order template");
      console.error("Template creation error:", error);
    }
  });
};

export const useUpdateWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Tables["work_order_templates"]["Update"] }) =>
      workOrdersEnhancedApi.updateWorkOrderTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update template");
      console.error("Template update error:", error);
    }
  });
};

export const useDeleteWorkOrderTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.deleteWorkOrderTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-order-templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete template");
      console.error("Template deletion error:", error);
    }
  });
};

// Checklist Items
export const useChecklistItems = (workOrderId: string) => {
  return useQuery({
    queryKey: ["checklist-items", workOrderId],
    queryFn: () => workOrdersEnhancedApi.getChecklistItems(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createChecklistItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", data.work_order_id] });
      toast.success("Checklist item added");
    },
    onError: (error) => {
      toast.error("Failed to add checklist item");
      console.error("Checklist item creation error:", error);
    }
  });
};

export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Tables["checklist_items"]["Update"] }) =>
      workOrdersEnhancedApi.updateChecklistItem(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items", data.work_order_id] });
    },
    onError: (error) => {
      toast.error("Failed to update checklist item");
      console.error("Checklist item update error:", error);
    }
  });
};

export const useDeleteChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.deleteChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
      toast.success("Checklist item deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete checklist item");
      console.error("Checklist item deletion error:", error);
    }
  });
};

// Attachments
export const useWorkOrderAttachments = (workOrderId: string) => {
  return useQuery({
    queryKey: ["work-order-attachments", workOrderId],
    queryFn: () => workOrdersEnhancedApi.getWorkOrderAttachments(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createAttachment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["work-order-attachments", data.work_order_id] });
      toast.success("File attached successfully");
    },
    onError: (error) => {
      toast.error("Failed to attach file");
      console.error("Attachment creation error:", error);
    }
  });
};

// Time Logs
export const useTimeLogs = (workOrderId: string) => {
  return useQuery({
    queryKey: ["time-logs", workOrderId],
    queryFn: () => workOrdersEnhancedApi.getTimeLogs(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateTimeLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createTimeLog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs", data.work_order_id] });
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Time logged successfully");
    },
    onError: (error) => {
      toast.error("Failed to log time");
      console.error("Time log creation error:", error);
    }
  });
};

// Comments
export const useWorkOrderComments = (workOrderId: string) => {
  return useQuery({
    queryKey: ["work-order-comments", workOrderId],
    queryFn: () => workOrdersEnhancedApi.getWorkOrderComments(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateWorkOrderComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workOrdersEnhancedApi.createWorkOrderComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["work-order-comments", data.work_order_id] });
    },
    onError: (error) => {
      toast.error("Failed to add comment");
      console.error("Comment creation error:", error);
    }
  });
};

// Enhanced Work Order Operations
export const useCreateWorkOrderFromTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ templateId, workOrderData }: { 
      templateId: string; 
      workOrderData: Partial<Tables["work_orders"]["Insert"]> 
    }) => workOrdersEnhancedApi.createWorkOrderFromTemplate(templateId, workOrderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Work order created from template");
    },
    onError: (error) => {
      toast.error("Failed to create work order from template");
      console.error("Template work order creation error:", error);
    }
  });
};

export const useUpdateWorkOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      workOrdersEnhancedApi.updateWorkOrderStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      toast.success("Work order status updated");
    },
    onError: (error) => {
      toast.error("Failed to update work order status");
      console.error("Status update error:", error);
    }
  });
};
