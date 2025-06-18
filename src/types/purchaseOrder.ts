
export type PurchaseOrderStatus =
  | 'draft'
  | 'pending'
  | 'pending_approval'
  | 'approved'
  | 'ordered'
  | 'received'
  | 'cancelled'
  | 'rejected';

export type ApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected';

// Simplified vendor interface to match current usage
export interface Vendor {
  id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  payment_terms?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PurchaseOrderApprovalRule {
  id: string;
  tenant_id: string;
  name: string;
  min_amount: number;
  max_amount?: number;
  required_approver_role: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderApproval {
  id: string;
  purchase_order_id: string;
  approver_id: string;
  status: ApprovalStatus;
  comments?: string;
  approved_at?: string;
  created_at: string;
  rule_id?: string;
  approver?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
  rule?: PurchaseOrderApprovalRule;
}

export interface PurchaseOrderAttachment {
  id: string;
  purchase_order_id: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface PurchaseOrder {
  id: string;
  tenant_id: string;
  po_number: string;
  vendor?: string; // Keep as string to match current schema
  status: PurchaseOrderStatus;
  total_amount: number;
  tax_amount?: number;
  shipping_amount?: number;
  notes?: string;
  due_date?: string;
  requested_by: string;
  approved_by?: string;
  billing_address?: Address;
  shipping_address?: Address;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  line_items?: PurchaseOrderLineItem[];
  approvals?: PurchaseOrderApproval[];
  attachments?: PurchaseOrderAttachment[];
}

export interface PurchaseOrderLineItem {
  id: string;
  purchase_order_id: string;
  inventory_item_id?: string;
  inventory_item?: {
    id: string;
    name: string;
    sku?: string;
    unit_cost?: number;
  };
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount: number;
  received_quantity?: number;
  created_at: string;
}

// Align with current database schema
export interface CreatePurchaseOrderRequest {
  vendor: string; // Use string vendor to match current schema
  po_number: string;
  notes?: string;
  due_date?: string;
  line_items: {
    inventory_item_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
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
    id?: string;
    inventory_item_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }[];
}

export interface SubmitForApprovalRequest {
  id: string;
  comment?: string;
}

export interface ApprovalDecisionRequest {
  purchase_order_id: string;
  rule_id: string;
  decision: 'approved' | 'rejected';
  comments?: string;
}

export interface FulfillmentRequest {
  purchase_order_id: string;
  line_item_id: string;
  received_quantity: number;
  notes?: string;
}
