
export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo: string[];
  assigned_to?: string | null;
  dueDate?: string | null;
  due_date?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  timeSpent?: number;
  time_spent?: number;
  totalCost?: number;
  total_cost?: number;
  partsUsed?: any[];
  parts_used?: any[];
  tags?: string[];
  asset?: {
    name: string;
    location?: string;
  } | null;
  location?: {
    name: string;
  } | null;
  requester_id?: string | null;
  tenant_id?: string;
  asset_id?: string | null;
  location_id?: string | null;
}

export type WorkOrderStatus = 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface WorkOrderFilters {
  search: string;
  status: 'all' | WorkOrderStatus;
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: 'all' | 'me' | 'unassigned';
  category: 'all' | string;
}
