
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/lib/database/work-orders";
import { useCopyAssetProceduresToWorkOrder } from "./usePurchaseOrderOperations";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

export const useCreateWorkOrderEnhanced = () => {
  const queryClient = useQueryClient();
  const copyProceduresMutation = useCopyAssetProceduresToWorkOrder();

  return useMutation({
    mutationFn: async (workOrder: Tables["work_orders"]["Insert"]) => {
      console.log("Creating work order:", workOrder);
      
      // Create the work order
      const newWorkOrder = await workOrdersApi.createWorkOrder(workOrder);
      
      // If there's an asset_id, copy default procedures
      if (newWorkOrder.asset_id) {
        console.log("Copying procedures for asset:", newWorkOrder.asset_id);
        await copyProceduresMutation.mutateAsync({
          assetId: newWorkOrder.asset_id,
          workOrderId: newWorkOrder.id
        });
      }
      
      return newWorkOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
};
