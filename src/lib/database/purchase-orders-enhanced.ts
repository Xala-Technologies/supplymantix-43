
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { 
  CreatePurchaseOrderRequest, 
  UpdatePurchaseOrderRequest,
  PurchaseOrder
} from "@/types/purchaseOrder";

type Tables = Database["public"]["Tables"];

// Simplified enhanced API that works with current schema
export const purchaseOrdersEnhancedApi = {
  // Use existing purchase orders API for now
  async getAllPurchaseOrders(filters?: {
    status?: string;
    vendor?: string;
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
        requester:users!purchase_orders_requested_by_fkey(first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status && ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'].includes(filters.status)) {
      query = query.eq("status", filters.status);
    }
    if (filters?.vendor) {
      query = query.eq("vendor", filters.vendor);
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

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform to match PurchaseOrder interface
    return data?.map(po => ({
      ...po,
      line_items: Array.isArray(po.line_items) ? po.line_items : []
    })) as PurchaseOrder[];
  },

  async getPurchaseOrderById(id: string) {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        purchase_order_line_items(*)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    // Transform to match PurchaseOrder interface
    return {
      ...data,
      line_items: data.purchase_order_line_items || []
    } as PurchaseOrder;
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
            quantity: item.quantity,
            unit_price: item.unit_price,
          });

        if (lineError) throw lineError;
      }
    }

    return {
      ...po,
      line_items: []
    } as PurchaseOrder;
  },

  // Placeholder methods for future implementation
  async getVendors() {
    // Return empty array for now - will be implemented when vendors table is created
    return [];
  },

  async createVendor(vendor: any) {
    throw new Error("Vendor management not yet implemented");
  },

  async softDeletePurchaseOrder(id: string) {
    throw new Error("Soft delete not yet implemented");
  },

  async restorePurchaseOrder(id: string) {
    throw new Error("Restore not yet implemented");
  },

  async submitForApproval(request: any) {
    throw new Error("Approval workflow not yet implemented");
  },

  async approveOrRejectPurchaseOrder(request: any) {
    throw new Error("Approval workflow not yet implemented");
  },

  async fulfillLineItem(request: any) {
    throw new Error("Fulfillment not yet implemented");
  },

  async uploadAttachment(purchaseOrderId: string, file: File) {
    throw new Error("Attachments not yet implemented");
  },

  async generatePOPdf(id: string) {
    return `/api/purchase-orders/${id}/pdf`;
  },

  async exportPOCsv(id: string) {
    const po = await this.getPurchaseOrderById(id);
    
    const headers = [
      'PO Number', 'Vendor', 'Status', 'Item Description', 
      'Quantity', 'Unit Price', 'Total Amount', 'Created Date'
    ];
    
    const rows = po.line_items?.map((item: any) => [
      po.po_number,
      po.vendor || '',
      po.status,
      item.description || '',
      item.quantity.toString(),
      item.unit_price.toString(),
      (item.quantity * item.unit_price).toString(),
      po.created_at
    ]) || [];
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
};
