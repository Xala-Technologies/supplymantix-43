
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proceduresEnhancedApi } from "@/lib/database/procedures-enhanced";
import { toast } from "sonner";

// Get procedures with filters
export const useProceduresEnhanced = (params?: {
  search?: string;
  category?: string;
  tags?: string[];
  is_global?: boolean;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["procedures-enhanced", params],
    queryFn: () => proceduresEnhancedApi.getProcedures(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get single procedure
export const useProcedure = (id: string) => {
  return useQuery({
    queryKey: ["procedure", id],
    queryFn: () => proceduresEnhancedApi.getProcedure(id),
    enabled: !!id,
  });
};

// Create procedure
export const useCreateProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proceduresEnhancedApi.createProcedure,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["procedures-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success(`Procedure "${data.title}" created successfully`);
    },
    onError: (error) => {
      console.error("Failed to create procedure:", error);
      toast.error("Failed to create procedure: " + (error as Error).message);
    },
  });
};

// Update procedure
export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      proceduresEnhancedApi.updateProcedure(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["procedures-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      queryClient.invalidateQueries({ queryKey: ["procedure", data.id] });
      toast.success("Procedure updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update procedure:", error);
      toast.error("Failed to update procedure: " + (error as Error).message);
    },
  });
};

// Delete procedure
export const useDeleteProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proceduresEnhancedApi.deleteProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedure deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete procedure:", error);
      toast.error("Failed to delete procedure: " + (error as Error).message);
    },
  });
};

// Duplicate procedure
export const useDuplicateProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle?: string }) =>
      proceduresEnhancedApi.duplicateProcedure(id, newTitle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["procedures-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success(`Procedure duplicated as "${data.title}"`);
    },
    onError: (error) => {
      console.error("Failed to duplicate procedure:", error);
      toast.error("Failed to duplicate procedure: " + (error as Error).message);
    },
  });
};

// Execution hooks
export const useStartExecution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ procedureId, workOrderId }: { procedureId: string; workOrderId?: string }) =>
      proceduresEnhancedApi.startExecution(procedureId, workOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedure-executions"] });
      toast.success("Procedure execution started");
    },
    onError: (error) => {
      console.error("Failed to start execution:", error);
      toast.error("Failed to start execution: " + (error as Error).message);
    },
  });
};

export const useSubmitExecution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ executionId, answers, score }: { executionId: string; answers: any; score?: number }) =>
      proceduresEnhancedApi.submitExecution(executionId, answers, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedure-executions"] });
      toast.success("Procedure execution completed");
    },
    onError: (error) => {
      console.error("Failed to submit execution:", error);
      toast.error("Failed to submit execution: " + (error as Error).message);
    },
  });
};

export const useProcedureExecutions = (procedureId: string) => {
  return useQuery({
    queryKey: ["procedure-executions", procedureId],
    queryFn: () => proceduresEnhancedApi.getExecutions(procedureId),
    enabled: !!procedureId,
  });
};

// Templates
export const useProcedureTemplates = () => {
  return useQuery({
    queryKey: ["procedure-templates"],
    queryFn: proceduresEnhancedApi.getTemplates,
  });
};

export const useSaveTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proceduresEnhancedApi.saveTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["procedure-templates"] });
      toast.success(`Template "${data.name}" saved successfully`);
    },
    onError: (error) => {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template: " + (error as Error).message);
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proceduresEnhancedApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedure-templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template: " + (error as Error).message);
    },
  });
};
