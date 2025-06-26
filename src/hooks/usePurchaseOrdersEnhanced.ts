
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { purchaseOrdersEnhancedApi } from "@/lib/database/purchase-orders-enhanced";

export const usePurchaseOrderByIdEnhanced = (id: string) => {
  return useQuery({
    queryKey: ["purchase-order-enhanced", id],
    queryFn: () => purchaseOrdersEnhancedApi.getPurchaseOrderById(id),
    enabled: !!id,
  });
};

export const useExportPOCsv = () => {
  return useMutation({
    mutationFn: async (poId: string) => {
      console.log("Exporting CSV for PO:", poId);
      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      toast.success("CSV export started");
    },
    onError: () => {
      toast.error("Failed to export CSV");
    },
  });
};

export const useGeneratePOPdf = () => {
  return useMutation({
    mutationFn: async (poId: string) => {
      console.log("Generating PDF for PO:", poId);
      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      toast.success("PDF generation started");
    },
    onError: () => {
      toast.error("Failed to generate PDF");
    },
  });
};

export const usePurchaseOrderApprovals = (purchaseOrderId: string) => {
  return useQuery({
    queryKey: ["purchase-order-approvals", purchaseOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_order_approvals")
        .select(`
          *,
          approver:users!purchase_order_approvals_approver_id_fkey(first_name, last_name, email),
          rule:purchase_order_approval_rules(*)
        `)
        .eq("purchase_order_id", purchaseOrderId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!purchaseOrderId,
  });
};

export const useSubmitForApproval = () => {
  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      console.log("Submitting PO for approval:", id, comment);
      // Mock implementation - update PO status to pending_approval
      const { data, error } = await supabase
        .from("purchase_orders")
        .update({ status: "pending_approval" })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Purchase order submitted for approval");
    },
    onError: () => {
      toast.error("Failed to submit for approval");
    },
  });
};

export const useApproveOrRejectPurchaseOrder = () => {
  return useMutation({
    mutationFn: async ({ 
      purchase_order_id, 
      rule_id, 
      decision, 
      comments 
    }: { 
      purchase_order_id: string; 
      rule_id: string; 
      decision: 'approved' | 'rejected'; 
      comments: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("purchase_order_approvals")
        .insert({
          purchase_order_id,
          rule_id,
          approver_id: user.id,
          status: decision,
          comments,
          approved_at: decision === 'approved' ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Purchase order ${data.status}`);
    },
    onError: () => {
      toast.error("Failed to process approval");
    },
  });
};
