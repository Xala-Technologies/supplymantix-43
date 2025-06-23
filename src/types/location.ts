
export interface Location {
  id: string;
  name: string;
  description: string | null;
  tenant_id: string;
  parent_id: string | null;
  location_code: string | null;
  location_type: string;
  address: string | null;
  coordinates: any | null;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface LocationHierarchy extends Location {
  level: number;
  path: string[];
  children?: LocationHierarchy[];
}

export interface LocationFormData {
  name: string;
  description?: string;
  parent_id?: string | null;
  location_code?: string;
  location_type?: string;
  address?: string;
  coordinates?: any;
  metadata?: any;
}

export interface LocationStats {
  asset_count: number;
  meter_count: number;
  work_order_count: number;
  child_location_count: number;
}

export interface LocationBreadcrumb {
  id: string;
  name: string;
  level: number;
}

export const LOCATION_TYPES = [
  { value: 'building', label: 'Building', icon: '🏢' },
  { value: 'floor', label: 'Floor', icon: '🏪' },
  { value: 'room', label: 'Room', icon: '🚪' },
  { value: 'warehouse', label: 'Warehouse', icon: '🏭' },
  { value: 'facility', label: 'Facility', icon: '🏤' },
  { value: 'zone', label: 'Zone', icon: '📍' },
  { value: 'area', label: 'Area', icon: '📐' },
  { value: 'general', label: 'General', icon: '📍' },
] as const;
