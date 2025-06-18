
import { WorkOrder } from '@/types/workOrder';

export const transformWorkOrderData = (workOrder: any): WorkOrder => {
  return {
    id: workOrder.id,
    title: workOrder.title || 'Untitled Work Order',
    status: workOrder.status || 'open',
    due_date: workOrder.due_date || workOrder.dueDate || new Date().toISOString(),
    dueDate: workOrder.due_date || workOrder.dueDate || new Date().toISOString(), // Support both formats
    priority: workOrder.priority || 'medium',
    assignedTo: workOrder.assigned_to ? [workOrder.assigned_to] : [],
    description: workOrder.description || '',
    asset: typeof workOrder.asset === 'string' ? {
      id: workOrder.asset_id || '',
      name: workOrder.asset || 'Unknown Asset',
      status: 'active',
    } : {
      id: workOrder.asset?.id || workOrder.asset_id || '',
      name: workOrder.asset?.name || workOrder.assets?.name || 'Unknown Asset',
      status: workOrder.asset?.status || workOrder.assets?.status || 'active',
    },
    location: typeof workOrder.location === 'string' ? workOrder.location : workOrder.locations?.name || workOrder.location || 'Unknown Location',
    category: workOrder.category || 'maintenance',
    time_spent: workOrder.time_spent || workOrder.timeSpent || 0,
    timeSpent: workOrder.time_spent || workOrder.timeSpent || 0, // Support both formats
    total_cost: workOrder.total_cost || workOrder.totalCost || 0,
    totalCost: workOrder.total_cost || workOrder.totalCost || 0, // Support both formats
    parts_used: workOrder.parts_used ? (typeof workOrder.parts_used === 'string' ? JSON.parse(workOrder.parts_used) : workOrder.parts_used) : [],
    partsUsed: workOrder.parts_used ? (typeof workOrder.parts_used === 'string' ? JSON.parse(workOrder.parts_used) : workOrder.parts_used) : [], // Support both formats
    created_at: workOrder.created_at || workOrder.createdAt,
    createdAt: workOrder.created_at || workOrder.createdAt, // Support both formats
    updated_at: workOrder.updated_at,
    tenant_id: workOrder.tenant_id,
    tags: workOrder.tags || [],
  };
};

export const getStatusColor = (status: string): string => {
  const colors = {
    'open': 'bg-gray-100 text-gray-800 border-gray-200',
    'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'on_hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status.toLowerCase()] || colors.open;
};

export const getPriorityColor = (priority: string): string => {
  const colors = {
    'low': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-red-500',
  };
  return colors[priority.toLowerCase()] || colors.medium;
};

export const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};
