
export type WorkOrderStatus = 'draft' | 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'archived';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: PriorityLevel;
  requester_id?: string;
  assigned_to?: string; // assigneeId
  asset_id?: string;
  location_id?: string;
  tags: string[];
  start_date?: string;
  due_date?: string;
  template_id?: string;
  recurrence_rules?: RecurrenceRules;
  tenant_id: string;
  time_spent?: number;
  total_cost?: number;
  parts_used?: Array<{
    name: string;
    quantity: number;
    cost?: number;
  }>;
  category?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  asset?: {
    id: string;
    name: string;
    status: string;
  };
  location?: {
    id: string;
    name: string;
  };
  assignedTo: string[];
}

export interface ChecklistItem {
  id: string;
  work_order_id: string;
  title: string;
  completed: boolean;
  note?: string;
  created_at: string;
}

export interface WorkOrderTemplate {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  default_tags: string[];
  default_assignee?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateChecklistItem {
  id: string;
  template_id: string;
  title: string;
  note?: string;
  order_index: number;
  created_at: string;
}

export interface WorkOrderAttachment {
  id: string;
  work_order_id: string;
  url: string;
  file_name: string;
  uploaded_at: string;
}

export interface TimeLog {
  id: string;
  work_order_id: string;
  user_id: string;
  duration_minutes: number;
  note?: string;
  logged_at: string;
}

export interface WorkOrderComment {
  id: string;
  work_order_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface RecurrenceRules {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface WorkOrderFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  category: string;
}
