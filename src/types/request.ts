
export interface Request {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  requested_by?: string;
  assigned_to?: string;
  asset_id?: string;
  location?: string;
  due_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  attachments?: any[];
  created_at: string;
  updated_at: string;
}

export interface CreateRequestRequest {
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  asset_id?: string;
  location?: string;
  due_date?: string;
  estimated_cost?: number;
  notes?: string;
}

export interface UpdateRequestRequest extends Partial<CreateRequestRequest> {
  id: string;
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  actual_cost?: number;
}

export interface RequestComment {
  id: string;
  request_id: string;
  user_id?: string;
  comment: string;
  created_at: string;
}
