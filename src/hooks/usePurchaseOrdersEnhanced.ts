
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersEnhancedApi } from "@/lib/database/purchase-orders-enhanced";
import { toast } from "sonner";
import type { 
  UpdatePurchaseOrderRequest,
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

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => purchaseOrdersEnhancedApi.getVendors(),
    staleTime: 10 * 60 * 1000,
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

export const useSubmitForApproval = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Approval workflow not yet implemented");
    },
  });
};

export const useApproveOrRejectPurchaseOrder = () => {
  return useMutation({
    mutationFn: () => {
      throw new Error("Approval workflow not yet implemented");
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
