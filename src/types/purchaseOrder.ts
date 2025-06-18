
export type PurchaseOrderStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'ordered'
  | 'partially_fulfilled'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type ApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected';

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

export interface PurchaseOrderApproval {
  id: string;
  purchase_order_id: string;
  approver_id: string;
  status: ApprovalStatus;
  approved_at?: string;
  comments?: string;
  created_at: string;
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
  vendor_id: string;
  vendor?: Vendor;
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

export interface CreatePurchaseOrderRequest {
  vendor_id: string;
  po_number: string;
  notes?: string;
  due_date?: string;
  billing_address?: Omit<Address, 'id'>;
  shipping_address?: Omit<Address, 'id'>;
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
  vendor_id?: string;
  po_number?: string;
  status?: PurchaseOrderStatus;
  notes?: string;
  due_date?: string;
  billing_address?: Omit<Address, 'id'>;
  shipping_address?: Omit<Address, 'id'>;
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
  decision: 'approved' | 'rejected';
  comments?: string;
}

export interface FulfillmentRequest {
  purchase_order_id: string;
  line_item_id: string;
  received_quantity: number;
  notes?: string;
}

export interface POSettings {
  id: string;
  tenant_id: string;
  po_number_prefix: string;
  po_number_format: string;
  default_billing_address?: Address;
  default_shipping_address?: Address;
  approval_rules: ApprovalRule[];
  cc_emails: string[];
  custom_fields: CustomField[];
}

export interface ApprovalRule {
  id: string;
  name: string;
  amount_min?: number;
  amount_max?: number;
  required_roles: string[];
  departments?: string[];
  order: number;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
  order: number;
}
