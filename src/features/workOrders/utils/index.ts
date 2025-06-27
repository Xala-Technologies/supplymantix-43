
import type { Database } from "@/integrations/supabase/types";

type WorkOrderRow = Database["public"]["Tables"]["work_orders"]["Row"] & {
  assets?: { name: string; location: string } | null;
  users?: { email: string } | null;
  locations?: { name: string } | null;
};

export const normalizeWorkOrderData = (rawWorkOrder: WorkOrderRow) => {
  console.log('Normalizing work order:', rawWorkOrder.id, rawWorkOrder);
  
  try {
    const normalized = {
      id: rawWorkOrder.id,
      title: rawWorkOrder.title || 'Untitled Work Order',
      description: rawWorkOrder.description || '',
      status: rawWorkOrder.status || 'open',
      priority: rawWorkOrder.priority || 'medium',
      category: rawWorkOrder.category || 'maintenance',
      assignedTo: rawWorkOrder.assigned_to ? [rawWorkOrder.users?.email || rawWorkOrder.assigned_to] : [],
      assigned_to: rawWorkOrder.assigned_to,
      dueDate: rawWorkOrder.due_date,
      due_date: rawWorkOrder.due_date,
      createdAt: rawWorkOrder.created_at,
      created_at: rawWorkOrder.created_at,
      updatedAt: rawWorkOrder.updated_at,
      updated_at: rawWorkOrder.updated_at,
      timeSpent: rawWorkOrder.time_spent || 0,
      time_spent: rawWorkOrder.time_spent || 0,
      totalCost: rawWorkOrder.total_cost || 0,
      total_cost: rawWorkOrder.total_cost || 0,
      partsUsed: rawWorkOrder.parts_used || [],
      parts_used: rawWorkOrder.parts_used || [],
      tags: rawWorkOrder.tags || [],
      asset: rawWorkOrder.assets ? {
        name: rawWorkOrder.assets.name,
        location: rawWorkOrder.assets.location
      } : null,
      location: rawWorkOrder.locations ? {
        name: rawWorkOrder.locations.name
      } : null,
      requester_id: rawWorkOrder.requester_id,
      tenant_id: rawWorkOrder.tenant_id,
      asset_id: rawWorkOrder.asset_id,
      location_id: rawWorkOrder.location_id
    };
    
    console.log('Normalized work order:', normalized);
    return normalized;
  } catch (error) {
    console.error('Error normalizing work order:', error, rawWorkOrder);
    // Return a safe fallback
    return {
      id: rawWorkOrder.id,
      title: rawWorkOrder.title || 'Untitled Work Order',
      description: rawWorkOrder.description || '',
      status: rawWorkOrder.status || 'open',
      priority: rawWorkOrder.priority || 'medium',
      category: rawWorkOrder.category || 'maintenance',
      assignedTo: [],
      assigned_to: rawWorkOrder.assigned_to,
      dueDate: rawWorkOrder.due_date,
      due_date: rawWorkOrder.due_date,
      createdAt: rawWorkOrder.created_at,
      created_at: rawWorkOrder.created_at,
      updatedAt: rawWorkOrder.updated_at,
      updated_at: rawWorkOrder.updated_at,
      timeSpent: 0,
      time_spent: 0,
      totalCost: 0,
      total_cost: 0,
      partsUsed: [],
      parts_used: [],
      tags: [],
      asset: null,
      location: null,
      requester_id: rawWorkOrder.requester_id,
      tenant_id: rawWorkOrder.tenant_id,
      asset_id: rawWorkOrder.asset_id,
      location_id: rawWorkOrder.location_id
    };
  }
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'on_hold':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const extractAssetInfo = (asset: any) => {
  if (!asset) return null;
  if (typeof asset === 'string') return { name: asset };
  return asset;
};

export const extractLocationInfo = (location: any) => {
  if (!location) return null;
  if (typeof location === 'string') return { name: location };
  return location;
};
