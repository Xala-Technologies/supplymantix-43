
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { 
  CreatePurchaseOrderRequest, 
  UpdatePurchaseOrderRequest,
  PurchaseOrder,
  PurchaseOrderLineItem,
  PurchaseOrderStatus
} from "@/types/purchaseOrder";

type Tables = Database["public"]["Tables"];
type PurchaseOrderRow = Tables["purchase_orders"]["Row"];
type PurchaseOrderLineItemRow = Tables["purchase_order_line_items"]["Row"];

// Valid status values from the database enum
const validStatuses: PurchaseOrderStatus[] = ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];

// Transform database line item to interface
const transformLineItem = (dbItem: PurchaseOrderLineItemRow): PurchaseOrderLineItem => ({
  id: dbItem.id,
  purchase_order_id: dbItem.purchase_order_id,
  inventory_item_id: dbItem.inventory_item_id || undefined,
  description: `Item ${dbItem.id}`, // Fallback description since it's not in DB
  quantity: dbItem.quantity,
  unit_price: dbItem.unit_price,
  total_amount: dbItem.quantity * dbItem.unit_price,
  created_at: dbItem.created_at || new Date().toISOString(),
});

// Transform database PO to interface
const transformPurchaseOrder = (dbPo: any, lineItems: PurchaseOrderLineItem[] = []): PurchaseOrder => ({
  id: dbPo.id,
  tenant_id: dbPo.tenant_id,
  po_number: dbPo.po_number,
  vendor: dbPo.vendor || undefined,
  status: dbPo.status as PurchaseOrderStatus,
  total_amount: dbPo.total_amount || 0,
  tax_amount: undefined,
  shipping_amount: undefined,
  notes: dbPo.notes || undefined,
  due_date: dbPo.due_date || undefined,
  requested_by: dbPo.requested_by || '',
  approved_by: dbPo.approved_by || undefined,
  billing_address: undefined,
  shipping_address: undefined,
  created_at: dbPo.created_at || new Date().toISOString(),
  updated_at: dbPo.updated_at || new Date().toISOString(),
  deleted_at: undefined,
  line_items: lineItems,
  approvals: undefined,
  attachments: undefined,
});

// Simplified enhanced API that works with current schema
export const purchaseOrdersEnhancedApi = {
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

    // Only filter by status if it's a valid enum value
    if (filters?.status && validStatuses.includes(filters.status as PurchaseOrderStatus)) {
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
    return data?.map(po => transformPurchaseOrder(po)) || [];
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
    
    // Transform line items
    const lineItems = (data.purchase_order_line_items || []).map(transformLineItem);
    
    // Transform to match PurchaseOrder interface
    return transformPurchaseOrder(data, lineItems);
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

    return transformPurchaseOrder(po);
  },

  // Placeholder methods for future implementation
  async getVendors() {
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
    
    const rows = po.line_items?.map((item: PurchaseOrderLineItem) => [
      po.po_number,
      po.vendor || '',
      po.status,
      item.description || '',
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
