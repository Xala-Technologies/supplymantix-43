
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersApi } from "@/lib/database/purchase-orders";
import { useIncrementInventoryFromPO } from "./usePurchaseOrderOperations";
import type { UpdatePurchaseOrderRequest } from "@/types/purchaseOrder";

export const useUpdatePurchaseOrderEnhanced = () => {
  const queryClient = useQueryClient();
  const incrementInventoryMutation = useIncrementInventoryFromPO();

  return useMutation({
    mutationFn: async (request: UpdatePurchaseOrderRequest) => {
      console.log("Updating purchase order:", request);
      const result = await purchaseOrdersApi.updatePurchaseOrder(request);
      
      // If status changed to 'received', increment inventory
      if (request.status === 'received') {
        console.log("PO marked as received, incrementing inventory...");
        await incrementInventoryMutation.mutateAsync(request.id);
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
    },
  });
};
