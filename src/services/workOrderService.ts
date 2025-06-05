
import { WorkOrder } from '@/types/workOrder';

export const transformWorkOrderData = (workOrder: any): WorkOrder => {
  return {
    id: workOrder.id,
    title: workOrder.title || 'Untitled Work Order',
    status: workOrder.status || 'open',
    dueDate: workOrder.due_date || new Date().toISOString(),
    priority: workOrder.priority || 'medium',
    assignedTo: workOrder.assigned_to ? [workOrder.assigned_to] : [],
    description: workOrder.description || '',
    asset: {
      id: workOrder.asset?.id || '',
      name: workOrder.asset?.name || workOrder.assets?.name || 'Unknown Asset',
      status: workOrder.asset?.status || workOrder.assets?.status || 'active',
    },
    location: workOrder.locations?.name || workOrder.location || 'Unknown Location',
    category: workOrder.category || 'maintenance',
    timeSpent: workOrder.time_spent || 0,
    totalCost: workOrder.total_cost || 0,
    partsUsed: workOrder.parts_used ? JSON.parse(workOrder.parts_used) : [],
    createdAt: workOrder.created_at,
    updatedAt: workOrder.updated_at,
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
