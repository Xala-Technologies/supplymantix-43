
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";

export const useProcedures = () => {
  return useQuery({
    queryKey: ["procedures"],
    queryFn: () => databaseApi.getProcedures(),
  });
};

export const useProcedure = (id: string) => {
  return useQuery({
    queryKey: ["procedure", id],
    queryFn: () => databaseApi.getProcedure(id),
    enabled: !!id,
  });
};

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: databaseApi.createProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedure created successfully");
    },
    onError: (error) => {
      console.error("Failed to create procedure:", error);
      toast.error("Failed to create procedure");
    },
  });
};

export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      databaseApi.updateProcedure(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedure updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update procedure:", error);
      toast.error("Failed to update procedure");
    },
  });
};

export const useDeleteProcedure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: databaseApi.deleteProcedure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedure deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete procedure:", error);
      toast.error("Failed to delete procedure");
    },
  });
};
