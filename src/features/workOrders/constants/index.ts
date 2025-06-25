
import { WorkOrderStatus, PriorityLevel, WorkOrderCategory } from '../types';

export const WORK_ORDER_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-green-500 text-white' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500 text-white' },
  { value: 'high', label: 'High', color: 'bg-orange-500 text-white' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500 text-white' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { value: 'repair', label: 'Repair', icon: '🛠️' },
  { value: 'inspection', label: 'Inspection', icon: '🔍' },
  { value: 'calibration', label: 'Calibration', icon: '⚖️' },
  { value: 'emergency', label: 'Emergency', icon: '🚨' },
] as const;

export const DEFAULT_WORK_ORDER_FILTERS = {
  search: '',
  status: '',
  priority: '',
  assignedTo: '',
  category: '',
};

export const WORK_ORDER_QUERY_KEYS = {
  all: ['work-orders'] as const,
  lists: () => [...WORK_ORDER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...WORK_ORDER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...WORK_ORDER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WORK_ORDER_QUERY_KEYS.details(), id] as const,
  comments: (id: string) => [...WORK_ORDER_QUERY_KEYS.detail(id), 'comments'] as const,
  attachments: (id: string) => [...WORK_ORDER_QUERY_KEYS.detail(id), 'attachments'] as const,
};
