
export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
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
    id: string;
    name: string;
    location?: string;
    status?: string;
  } | null;
  location?: {
    id: string;
    name: string;
  } | null;
  requester_id?: string | null;
  tenant_id?: string;
  asset_id?: string | null;
  location_id?: string | null;
  start_date?: string | null;
  template_id?: string | null;
  recurrence_rules?: any;
}

export type WorkOrderStatus = 'draft' | 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type WorkOrderCategory = 'maintenance' | 'repair' | 'inspection' | 'installation' | 'emergency' | 'calibration';

export interface WorkOrderAsset {
  id: string;
  name: string;
  location?: string;
  status?: string;
}

export interface WorkOrderLocation {
  id: string;
  name: string;
}

export interface WorkOrderFilters {
  search: string;
  status: 'all' | WorkOrderStatus;
  priority: 'all' | PriorityLevel;
  assignedTo: 'all' | 'me' | 'unassigned';
  category: 'all' | string;
}
