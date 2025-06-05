
export interface WorkOrder {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  description: string;
  asset: {
    id: string;
    name: string;
    status: string;
  };
  location: string;
  category: string;
  timeSpent?: number;
  totalCost?: number;
  partsUsed?: Array<{
    name: string;
    quantity: number;
    cost?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderFilters {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  category: string;
}
