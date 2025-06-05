
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "@/lib/database";
import { toast } from "sonner";
import type { CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from "@/types/purchaseOrder";

export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: () => {
      console.log("usePurchaseOrders: Fetching purchase orders...");
      return databaseApi.getPurchaseOrders();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePurchaseOrderById = (id: string) => {
  return useQuery({
    queryKey: ["purchase-order", id],
    queryFn: () => databaseApi.getPurchaseOrderById(id),
    enabled: !!id,
  });
};

export const usePurchaseOrderLineItems = (purchaseOrderId: string) => {
  return useQuery({
    queryKey: ["purchase-order-line-items", purchaseOrderId],
    queryFn: () => databaseApi.getPurchaseOrderLineItems(purchaseOrderId),
    enabled: !!purchaseOrderId,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePurchaseOrderRequest) => {
      console.log("useCreatePurchaseOrder: Creating purchase order with data:", data);
      return databaseApi.createPurchaseOrder(data);
    },
    onSuccess: (result) => {
      console.log("useCreatePurchaseOrder: Purchase order created successfully:", result);
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order created successfully");
    },
    onError: (error: Error) => {
      console.error("useCreatePurchaseOrder: Failed to create purchase order:", error);
      toast.error(`Failed to create purchase order: ${error.message}`);
    },
  });
};

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdatePurchaseOrderRequest) => databaseApi.updatePurchaseOrder(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order", data.id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-line-items", data.id] });
      toast.success("Purchase order updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase order: ${error.message}`);
    },
  });
};

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => databaseApi.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase order: ${error.message}`);
    },
  });
};
