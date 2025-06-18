
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersEnhancedApi } from "@/lib/database/purchase-orders-enhanced";
import { toast } from "sonner";
import type { 
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  SubmitForApprovalRequest,
  ApprovalDecisionRequest,
  FulfillmentRequest,
  Vendor
} from "@/types/purchaseOrder";

export const usePurchaseOrdersEnhanced = (filters?: {
  status?: string;
  vendor_id?: string;
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

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => purchaseOrdersEnhancedApi.getVendors(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) =>
      purchaseOrdersEnhancedApi.createVendor(vendor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create vendor: ${error.message}`);
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

export const useSoftDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => purchaseOrdersEnhancedApi.softDeletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      toast.success("Purchase order deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase order: ${error.message}`);
    },
  });
};

export const useRestorePurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => purchaseOrdersEnhancedApi.restorePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      toast.success("Purchase order restored successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to restore purchase order: ${error.message}`);
    },
  });
};

export const useSubmitForApproval = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: SubmitForApprovalRequest) =>
      purchaseOrdersEnhancedApi.submitForApproval(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
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
      const action = variables.decision === 'approved' ? 'approved' : 'rejected';
      toast.success(`Purchase order ${action} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to process approval: ${error.message}`);
    },
  });
};

export const useFulfillLineItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: FulfillmentRequest) =>
      purchaseOrdersEnhancedApi.fulfillLineItem(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders-enhanced"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order-enhanced", variables.purchase_order_id] });
      toast.success("Line item fulfilled successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to fulfill line item: ${error.message}`);
    },
  });
};

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ purchaseOrderId, file }: { purchaseOrderId: string; file: File }) =>
      purchaseOrdersEnhancedApi.uploadAttachment(purchaseOrderId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-order-enhanced", variables.purchaseOrderId] });
      toast.success("Attachment uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload attachment: ${error.message}`);
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
