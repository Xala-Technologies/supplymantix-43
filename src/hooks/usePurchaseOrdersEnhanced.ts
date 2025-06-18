import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersEnhancedApi } from "@/lib/database/purchase-orders-enhanced";
import { toast } from "sonner";
import type { 
  UpdatePurchaseOrderRequest,
  SubmitForApprovalRequest,
  ApprovalDecisionRequest
} from "@/types/purchaseOrder";

export const usePurchaseOrdersEnhanced = (filters?: {
  status?: string;
  vendor?: string;
  requested_by?: string;
  date_from?: string;
  date_to?: string;
  include_deleted?: boolean;
}) => {
  return useQuery({
    queryKey: ["purchase-orders-enhanced", filters],
    queryFn: () => purchaseOrdersEnhancedApi.getAllPurchaseOrders(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePurchaseOrderByIdEnhanced = (id: string) => {
  return useQuery({
    queryKey: ["purchase-order-enhanced", id],
    queryFn: () => purchaseOrdersEnhancedApi.getPurchaseOrderById(id),
    enabled: !!id,
  });
};

export const usePurchaseOrderApprovals = (purchaseOrderId: string) => {
  return useQuery({
    queryKey: ["purchase-order-approvals", purchaseOrderId],
    queryFn: () => purchaseOrdersEnhancedApi.getPurchaseOrderApprovals(purchaseOrderId),
    enabled: !!purchaseOrderId,
  });
};

export const useApprovalRules = () => {
  return useQuery({
    queryKey: ["approval-rules"],
    queryFn: () => purchaseOrdersEnhancedApi.getApprovalRules(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useSubmitForApproval = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: SubmitForApprovalRequest) =>
      purchaseOrdersEnhancedApi.submitForApproval(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-enhanced", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-approvals", variables.id] });
      toast.success("Purchase order submitted for approval");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit for approval: ${error.message}`);
    },
  });
};

export const useApproveOrRejectPurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: ApprovalDecisionRequest) =>
      purchaseOrdersEnhancedApi.approveOrRejectPurchaseOrder(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-enhanced", variables.purchase_order_id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-approvals", variables.purchase_order_id] });
      toast.success(`Purchase order ${variables.decision}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to process approval: ${error.message}`);
    },
  });
};

export const useUpdatePurchaseOrderEnhanced = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: UpdatePurchaseOrderRequest) =>
      purchaseOrdersEnhancedApi.updatePurchaseOrder(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-enhanced", data.id] });
      toast.success("Purchase order updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase order: ${error.message}`);
    },
  });
};

export const useExportPOCsv = () => {
  return useMutation({
    mutationFn: (id: string) => purchaseOrdersEnhancedApi.exportPOCsv(id),
    onSuccess: (csvContent, id) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase-order-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to export CSV: ${error.message}`);
    },
  });
};

// Placeholder hooks for future implementation
export const useCreateVendor = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Vendor management not yet implemented");
    },
  });
};

export const useSoftDeletePurchaseOrder = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Soft delete not yet implemented");
    },
  });
};

export const useRestorePurchaseOrder = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Restore not yet implemented");
    },
  });
};

export const useFulfillLineItem = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Fulfillment not yet implemented");
    },
  });
};

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Attachments not yet implemented");
    },
  });
};

export const useGeneratePOPdf = () => {
  return useMutation({
    mutationFn: (id: string) => purchaseOrdersEnhancedApi.generatePOPdf(id),
    onSuccess: (url) => {
      window.open(url, '_blank');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate PDF: ${error.message}`);
    },
  });
};
