
import { BaseEntity } from '@/shared/types/common';

export type WorkOrderStatus = 'draft' | 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type WorkOrderCategory = 'maintenance' | 'repair' | 'inspection' | 'calibration' | 'emergency';

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
  
  // Assignment
  requester_id?: string;
  assigned_to?: string;
  assignedTo: string[];
  
  // Asset and Location
  asset_id?: string;
  location_id?: string;
  asset?: WorkOrderAsset | string | null;
  location?: WorkOrderLocation | string | null;
  
  // Scheduling
  start_date?: string;
  due_date?: string;
  dueDate?: string; // Support both formats for compatibility
  
  // Resources and Costs
  time_spent?: number;
  timeSpent?: number; // Support both formats for compatibility
  total_cost?: number;
  totalCost?: number; // Support both formats for compatibility
  parts_used?: WorkOrderPart[];
  partsUsed?: WorkOrderPart[]; // Support both formats for compatibility
  
  // Additional Data
  tags: string[];
  template_id?: string;
  recurrence_rules?: RecurrenceRules;
  
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

export interface WorkOrderAttachment extends BaseEntity {
  work_order_id: string;
  url: string;
  file_name: string;
  uploaded_at: string;
}

export interface RecurrenceRules {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
}
