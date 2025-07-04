
import { BaseEntity } from '@/types/common';

export type WorkOrderStatus = 'draft' | 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type PriorityLevel = 'none' | 'low' | 'medium' | 'high' | 'urgent';
export type WorkOrderCategory = 'maintenance' | 'repair' | 'inspection' | 'calibration' | 'emergency';
export type WorkType = 'reactive' | 'preventive' | 'predictive' | 'emergency';
export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface WorkOrderAsset {
  id: string;
  name: string;
  status?: string;
  location?: string;
}

export interface WorkOrderLocation {
  id: string;
  name: string;
}

export interface WorkOrderPart {
  name: string;
  quantity: number;
  cost?: number;
}

export interface WorkOrder extends BaseEntity {
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: PriorityLevel;
  category: WorkOrderCategory;
  work_type?: WorkType;
  
  // Assignment
  requester_id?: string;
  assigned_to?: string;
  assignedTo: string[];
  assignments?: WorkOrderAssignment[];
  
  // Asset and Location
  asset_id?: string;
  location_id?: string;
  asset?: WorkOrderAsset | string | null;
  location?: WorkOrderLocation | string | null;
  
  // Scheduling & Time
  start_date?: string;
  due_date?: string;
  dueDate?: string; // Support both formats for compatibility
  estimated_hours?: number;
  estimated_minutes?: number;
  started_at?: string;
  completed_at?: string;
  
  // Resources and Costs
  time_spent?: number;
  timeSpent?: number; // Support both formats for compatibility
  total_cost?: number;
  totalCost?: number; // Support both formats for compatibility
  parts_used?: WorkOrderPart[];
  partsUsed?: WorkOrderPart[]; // Support both formats for compatibility
  
  // Relationships
  parent_id?: string;
  sub_orders?: WorkOrder[];
  procedure_id?: string;
  procedures?: WorkOrderProcedure[];
  vendor_id?: string;
  client_id?: string;
  
  // Additional Data
  tags: string[];
  template_id?: string;
  recurrence_rules?: RecurrenceRules;
  is_recurring?: boolean;
  recurring_parent_id?: string;
  
  // Attachments
  images?: WorkOrderImage[];
  attachments?: WorkOrderAttachment[];
  
  // History
  status_history?: WorkOrderStatusHistory[];
  
  // Compatibility fields
  createdAt?: string;
}

export interface WorkOrderFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  category: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface WorkOrderFormData {
  title: string;
  description?: string;
  priority: PriorityLevel;
  category: WorkOrderCategory;
  dueDate?: Date;
  assignedTo?: string;
  asset?: string;
  location?: string;
  tags?: string[];
}

export interface CreateWorkOrderRequest {
  title: string;
  description?: string;
  priority: PriorityLevel;
  category: WorkOrderCategory;
  due_date?: string;
  assigned_to?: string;
  asset_id?: string;
  location_id?: string;
  tags?: string[];
}

export interface UpdateWorkOrderRequest extends Partial<CreateWorkOrderRequest> {
  id: string;
  status?: WorkOrderStatus;
}

// Supporting interfaces
export interface ChecklistItem extends BaseEntity {
  work_order_id: string;
  title: string;
  completed: boolean;
  note?: string;
}

export interface WorkOrderTemplate extends BaseEntity {
  title: string;
  description?: string;
  priority: PriorityLevel;
  default_tags: string[];
  default_assignee?: string;
}

export interface WorkOrderComment extends BaseEntity {
  work_order_id: string;
  user_id: string;
  content: string;
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface TimeLog extends BaseEntity {
  work_order_id: string;
  user_id: string;
  duration_minutes: number;
  note?: string;
  logged_at: string;
}

export interface RecurrenceRules {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}

// New supporting interfaces
export interface WorkOrderAssignment extends BaseEntity {
  work_order_id: string;
  user_id: string;
  role: 'assignee' | 'reviewer' | 'supervisor';
  assigned_at: string;
  assigned_by?: string;
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface WorkOrderProcedure extends BaseEntity {
  work_order_id: string;
  procedure_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  notes?: string;
  procedure?: {
    id: string;
    title: string;
    description?: string;
  };
}

export interface WorkOrderPartUsed extends BaseEntity {
  work_order_id: string;
  inventory_item_id?: string;
  part_name: string;
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  notes?: string;
  used_at: string;
  used_by?: string;
}

export interface WorkOrderStatusHistory extends BaseEntity {
  work_order_id: string;
  old_status?: WorkOrderStatus;
  new_status: WorkOrderStatus;
  changed_by?: string;
  changed_at: string;
  notes?: string;
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface WorkOrderImage extends BaseEntity {
  work_order_id: string;
  url: string;
  file_name: string;
  file_size?: number;
  uploaded_at: string;
  uploaded_by?: string;
  caption?: string;
}

export interface WorkOrderAttachment extends WorkOrderImage {
  file_type: string;
}
