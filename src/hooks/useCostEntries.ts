
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { costEntriesApi } from "@/lib/database/cost-entries";
import { toast } from "sonner";

export const useCostEntries = (workOrderId: string) => {
  return useQuery({
    queryKey: ["cost-entries", workOrderId],
    queryFn: () => costEntriesApi.getCostEntries(workOrderId),
    enabled: !!workOrderId,
  });
};

export const useCreateCostEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: costEntriesApi.createCostEntry,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cost-entries", data.work_order_id] });
      toast.success("Cost entry added successfully");
    },
    onError: (error) => {
      console.error("Cost entry creation error:", error);
      toast.error("Failed to add cost entry");
    }
  });
};
