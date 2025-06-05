
export type PurchaseOrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'ordered'
  | 'received'
  | 'cancelled';

export interface PurchaseOrder {
  id: string;
  tenant_id: string;
  po_number: string;
  vendor: string;
  status: PurchaseOrderStatus;
  total_amount: number;
  notes?: string;
  due_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderLineItem {
  id: string;
  purchase_order_id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface CreatePurchaseOrderRequest {
  vendor: string;
  po_number: string;
  notes?: string;
  due_date?: string;
  line_items: {
    inventory_item_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface UpdatePurchaseOrderRequest {
  id: string;
  vendor?: string;
  po_number?: string;
  status?: PurchaseOrderStatus;
  notes?: string;
  due_date?: string;
  line_items?: {
    inventory_item_id: string;
    quantity: number;
    unit_price: number;
  }[];
}
