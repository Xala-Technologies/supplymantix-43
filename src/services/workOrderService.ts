
export const getStatusColor = (status: string) => {
  const colors = {
    'open': 'bg-gray-100 text-gray-800 border-gray-300',
    'in_progress': 'bg-blue-100 text-blue-800 border-blue-300',
    'on_hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'completed': 'bg-green-100 text-green-800 border-green-300',
    'cancelled': 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status.toLowerCase()] || colors.open;
};

export const getPriorityColor = (priority: string) => {
  const colors = {
    'low': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500',
  };
  return colors[priority.toLowerCase()] || colors.medium;
};

export const formatDueDate = (dateString: string) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  
  return date.toLocaleDateString();
};

export const transformWorkOrderData = (workOrder: any) => {
  return {
    ...workOrder,
    assignedTo: workOrder.assignedTo || (workOrder.assigned_to ? [workOrder.assigned_to] : []),
    dueDate: workOrder.dueDate || workOrder.due_date,
    createdAt: workOrder.createdAt || workOrder.created_at,
    timeSpent: workOrder.timeSpent || workOrder.time_spent || 0,
    totalCost: workOrder.totalCost || workOrder.total_cost || 0,
    partsUsed: workOrder.partsUsed || workOrder.parts_used || []
  };
};
