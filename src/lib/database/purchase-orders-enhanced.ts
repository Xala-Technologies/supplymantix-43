
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { 
  CreatePurchaseOrderRequest, 
  UpdatePurchaseOrderRequest,
  SubmitForApprovalRequest,
  ApprovalDecisionRequest,
  FulfillmentRequest,
  PurchaseOrder,
  Vendor
} from "@/types/purchaseOrder";

type Tables = Database["public"]["Tables"];

export const purchaseOrdersEnhancedApi = {
  // Vendor Management
  async getVendors() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { data: existingUser, error: userQueryError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", userData.user.id)
      .single();
    
    if (userQueryError || !existingUser) {
      throw new Error("User record not found");
    }

    const { data, error } = await supabase
      .from("vendors")
      .insert({
        ...vendor,
        tenant_id: existingUser.tenant_id,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Enhanced Purchase Order CRUD
  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        vendor:vendors(*),
        line_items:purchase_order_line_items(*),
        approvals:purchase_order_approvals(*),
        attachments:purchase_order_attachments(*)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data as PurchaseOrder;
  },

  async getAllPurchaseOrders(filters?: {
    status?: string;
    vendor_id?: string;
    requested_by?: string;
    date_from?: string;
    date_to?: string;
    include_deleted?: boolean;
  }) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    let query = supabase
      .from("purchase_orders")
      .select(`
        *,
        vendor:vendors(name),
        requester:users!purchase_orders_requested_by_fkey(first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.vendor_id) {
      query = query.eq("vendor_id", filters.vendor_id);
    }
    if (filters?.requested_by) {
      query = query.eq("requested_by", filters.requested_by);
    }
    if (filters?.date_from) {
      query = query.gte("created_at", filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte("created_at", filters.date_to);
    }
    if (!filters?.include_deleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async updatePurchaseOrder(request: UpdatePurchaseOrderRequest) {
    const { id, line_items, ...updates } = request;

    // Calculate totals if line items are provided
    if (line_items) {
      const totalAmount = line_items.reduce((sum, item) => {
        const lineTotal = item.quantity * item.unit_price;
        const taxAmount = item.tax_rate ? lineTotal * (item.tax_rate / 100) : 0;
        return sum + lineTotal + taxAmount;
      }, 0);
      (updates as any).total_amount = totalAmount;
    }

    // Update the purchase order
    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (poError) throw poError;

    // If line items are provided, replace them
    if (line_items) {
      // Delete existing line items
      const { error: deleteError } = await supabase
        .from("purchase_order_line_items")
        .delete()
        .eq("purchase_order_id", id);

      if (deleteError) throw deleteError;

      // Insert new line items
      for (const item of line_items) {
        const lineTotal = item.quantity * item.unit_price;
        const taxAmount = item.tax_rate ? lineTotal * (item.tax_rate / 100) : 0;
        
        const { error: lineError } = await supabase
          .from("purchase_order_line_items")
          .insert({
            purchase_order_id: id,
            inventory_item_id: item.inventory_item_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate || 0,
            tax_amount: taxAmount,
            total_amount: lineTotal + taxAmount,
          });

        if (lineError) throw lineError;
      }
    }

    return po;
  },

  async softDeletePurchaseOrder(id: string) {
    const { error } = await supabase
      .from("purchase_orders")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    
    if (error) throw error;
  },

  async restorePurchaseOrder(id: string) {
    const { error } = await supabase
      .from("purchase_orders")
      .update({ deleted_at: null })
      .eq("id", id);
    
    if (error) throw error;
  },

  // Approval Workflow
  async submitForApproval(request: SubmitForApprovalRequest) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Update PO status to submitted
    const { error: updateError } = await supabase
      .from("purchase_orders")
      .update({ status: 'submitted' })
      .eq("id", request.id);

    if (updateError) throw updateError;

    // Create approval record(s) based on approval rules
    // For now, create a single approval record - this should be enhanced based on approval rules
    const { error: approvalError } = await supabase
      .from("purchase_order_approvals")
      .insert({
        purchase_order_id: request.id,
        approver_id: userData.user.id, // This should be determined by approval rules
        status: 'pending',
        comments: request.comment,
      });

    if (approvalError) throw approvalError;
  },

  async approveOrRejectPurchaseOrder(request: ApprovalDecisionRequest) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Update approval record
    const { error: approvalError } = await supabase
      .from("purchase_order_approvals")
      .update({
        status: request.decision,
        approved_at: new Date().toISOString(),
        comments: request.comments,
      })
      .eq("purchase_order_id", request.purchase_order_id)
      .eq("approver_id", userData.user.id);

    if (approvalError) throw approvalError;

    // Update PO status based on decision
    const newStatus = request.decision === 'approved' ? 'approved' : 'rejected';
    const { error: poError } = await supabase
      .from("purchase_orders")
      .update({ 
        status: newStatus,
        approved_by: request.decision === 'approved' ? userData.user.id : null
      })
      .eq("id", request.purchase_order_id);

    if (poError) throw poError;
  },

  // Fulfillment
  async fulfillLineItem(request: FulfillmentRequest) {
    const { error } = await supabase
      .from("purchase_order_line_items")
      .update({
        received_quantity: request.received_quantity
      })
      .eq("id", request.line_item_id)
      .eq("purchase_order_id", request.purchase_order_id);

    if (error) throw error;

    // Check if all items are fulfilled and update PO status
    const { data: lineItems, error: lineItemsError } = await supabase
      .from("purchase_order_line_items")
      .select("quantity, received_quantity")
      .eq("purchase_order_id", request.purchase_order_id);

    if (lineItemsError) throw lineItemsError;

    const allFulfilled = lineItems.every(item => 
      (item.received_quantity || 0) >= item.quantity
    );
    const partiallyFulfilled = lineItems.some(item => 
      (item.received_quantity || 0) > 0
    );

    let newStatus = 'approved';
    if (allFulfilled) {
      newStatus = 'completed';
    } else if (partiallyFulfilled) {
      newStatus = 'partially_fulfilled';
    }

    const { error: statusError } = await supabase
      .from("purchase_orders")
      .update({ status: newStatus })
      .eq("id", request.purchase_order_id);

    if (statusError) throw statusError;
  },

  // Attachments
  async uploadAttachment(purchaseOrderId: string, file: File) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("purchase-orders")
      .upload(`attachments/${fileName}`, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("purchase-orders")
      .getPublicUrl(uploadData.path);

    // Save attachment record
    const { data, error } = await supabase
      .from("purchase_order_attachments")
      .insert({
        purchase_order_id: purchaseOrderId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Export functions
  async generatePOPdf(id: string) {
    // This would integrate with a PDF generation service
    // For now, return a placeholder
    return `/api/purchase-orders/${id}/pdf`;
  },

  async exportPOCsv(id: string) {
    const po = await this.getPurchaseOrderById(id);
    
    const headers = [
      'PO Number', 'Vendor', 'Status', 'Item Description', 
      'Quantity', 'Unit Price', 'Total Amount', 'Created Date'
    ];
    
    const rows = po.line_items?.map(item => [
      po.po_number,
      po.vendor?.name || '',
      po.status,
      item.description,
      item.quantity.toString(),
      item.unit_price.toString(),
      item.total_amount.toString(),
      po.created_at
    ]) || [];
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
};
