
import type { Database } from "@/integrations/supabase/types";
import type { WorkOrder, WorkOrderAsset, WorkOrderLocation } from "../types";

type WorkOrderRow = Database["public"]["Tables"]["work_orders"]["Row"] & {
  assets?: { name: string; location: string } | null;
  users?: { email: string } | null;
  locations?: { name: string } | null;
};

export const normalizeWorkOrderData = (rawWorkOrder: WorkOrderRow): WorkOrder => {
  console.log('Normalizing work order:', rawWorkOrder.id, rawWorkOrder);
  
  try {
    // Handle parts_used conversion
    let partsUsed: any[] = [];
    if (rawWorkOrder.parts_used) {
      if (Array.isArray(rawWorkOrder.parts_used)) {
        partsUsed = rawWorkOrder.parts_used as any[];
      } else if (typeof rawWorkOrder.parts_used === 'string') {
        try {
          partsUsed = JSON.parse(rawWorkOrder.parts_used);
        } catch {
          partsUsed = [];
        }
      }
    }

    // Handle asset conversion
    let asset: WorkOrderAsset | null = null;
    if (rawWorkOrder.assets) {
      asset = {
        id: rawWorkOrder.asset_id || '',
        name: rawWorkOrder.assets.name,
        location: rawWorkOrder.assets.location
      };
    }

    // Handle location conversion
    let location: WorkOrderLocation | null = null;
    if (rawWorkOrder.locations) {
      location = {
        id: rawWorkOrder.location_id || '',
        name: rawWorkOrder.locations.name
      };
    }

    const normalized: WorkOrder = {
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
      partsUsed: partsUsed,
      parts_used: partsUsed,
      tags: rawWorkOrder.tags || [],
      asset: asset,
      location: location,
      requester_id: rawWorkOrder.requester_id,
      tenant_id: rawWorkOrder.tenant_id,
      asset_id: rawWorkOrder.asset_id,
      location_id: rawWorkOrder.location_id,
      start_date: rawWorkOrder.start_date,
      template_id: rawWorkOrder.template_id,
      recurrence_rules: rawWorkOrder.recurrence_rules as any
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
      location_id: rawWorkOrder.location_id,
      start_date: rawWorkOrder.start_date,
      template_id: rawWorkOrder.template_id,
      recurrence_rules: rawWorkOrder.recurrence_rules as any
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
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-300';
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

export const extractAssetInfo = (asset: any): WorkOrderAsset | null => {
  if (!asset) return null;
  if (typeof asset === 'string') return { id: '', name: asset };
  if (typeof asset === 'object' && asset.name) {
    return {
      id: asset.id || '',
      name: asset.name,
      status: asset.status,
      location: asset.location
    };
  }
  return null;
};

export const extractLocationInfo = (location: any): WorkOrderLocation | null => {
  if (!location) return null;
  if (typeof location === 'string') return { id: '', name: location };
  if (typeof location === 'object' && location.name) {
    return {
      id: location.id || '',
      name: location.name
    };
  }
  return null;
};
