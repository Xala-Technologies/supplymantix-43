
import { WorkOrder, WorkOrderStatus, PriorityLevel } from '../types';
import { WORK_ORDER_STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants';

export const getStatusConfig = (status: WorkOrderStatus) => {
  return WORK_ORDER_STATUS_OPTIONS.find(option => option.value === status) || WORK_ORDER_STATUS_OPTIONS[0];
};

export const getPriorityConfig = (priority: PriorityLevel) => {
  return PRIORITY_OPTIONS.find(option => option.value === priority) || PRIORITY_OPTIONS[1];
};

export const getStatusColor = (status: WorkOrderStatus): string => {
  return getStatusConfig(status).color;
};

export const getPriorityColor = (priority: PriorityLevel): string => {
  return getPriorityConfig(priority).color;
};

export const extractAssetInfo = (asset: WorkOrder['asset']) => {
  if (!asset) return { id: '', name: 'No asset assigned' };
  if (typeof asset === 'string') return { id: asset, name: asset };
  return { id: asset.id, name: asset.name };
};

export const extractLocationInfo = (location: WorkOrder['location']) => {
  if (!location) return { id: '', name: 'No location' };
  if (typeof location === 'string') return { id: location, name: location };
  return { id: location.id, name: location.name };
};

export const extractAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
  if (!assignedTo || assignedTo.length === 0) return '';
  return Array.isArray(assignedTo) ? assignedTo[0] : assignedTo;
};

export const normalizeWorkOrderData = (workOrder: any): WorkOrder => {
  // Helper to safely parse JSON
  const parseJsonField = (field: any) => {
    if (!field) return [];
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  return {
    id: workOrder.id,
    title: workOrder.title || 'Untitled Work Order',
    description: workOrder.description || '',
    status: workOrder.status || 'open',
    priority: workOrder.priority || 'medium',
    category: workOrder.category || 'maintenance',
    
    // Assignment
    assigned_to: workOrder.assigned_to,
    assignedTo: workOrder.assigned_to ? [workOrder.assigned_to] : [],
    
    // Asset and Location
    asset_id: workOrder.asset_id,
    location_id: workOrder.location_id,
    asset: workOrder.assets ? {
      id: workOrder.asset_id || '',
      name: workOrder.assets.name || 'Unknown Asset',
      status: workOrder.assets.status || 'active'
    } : workOrder.asset_id || '',
    location: workOrder.locations?.name || workOrder.location_id || '',
    
    // Dates
    due_date: workOrder.due_date,
    dueDate: workOrder.due_date,
    start_date: workOrder.start_date,
    
    // Resources
    time_spent: workOrder.time_spent || 0,
    timeSpent: workOrder.time_spent || 0,
    total_cost: workOrder.total_cost || 0,
    totalCost: workOrder.total_cost || 0,
    parts_used: parseJsonField(workOrder.parts_used),
    partsUsed: parseJsonField(workOrder.parts_used),
    
    // Metadata
    tags: workOrder.tags || [],
    template_id: workOrder.template_id,
    recurrence_rules: workOrder.recurrence_rules,
    
    // Base entity fields
    created_at: workOrder.created_at,
    createdAt: workOrder.created_at,
    updated_at: workOrder.updated_at,
    tenant_id: workOrder.tenant_id,
    
    // Optional fields
    requester_id: workOrder.requester_id,
  };
};

export const validateWorkOrderData = (data: Partial<WorkOrder>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }
  
  return errors;
};
