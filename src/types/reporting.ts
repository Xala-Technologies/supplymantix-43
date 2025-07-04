export interface WorkOrderSummary {
  created: number;
  completed: number;
  date: string;
}

export interface GroupedWorkOrders {
  team: GroupedData[];
  user: GroupedData[];
  asset: GroupedData[];
  location: GroupedData[];
  category: GroupedData[];
  asset_type: GroupedData[];
  vendor: GroupedData[];
}

export interface GroupedData {
  id: string;
  name: string;
  members?: number;
  assetCount?: number;
  location?: string;
  created?: number;
  assigned: number;
  completed: number;
  ratio: number;
  email?: string;
}

export interface AssetHealthData {
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  healthScores: Array<{ category: string; score: number; trend: 'up' | 'down' | 'stable' }>;
  maintenanceSchedule: Array<{ asset: string; nextMaintenance: string; status: string; priority: string }>;
  uptimeData: Array<{ month: string; uptime: number }>;
}

export interface ActivityLog {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  action: 'created' | 'assigned' | 'reassigned' | 'comment' | 'status_change' | 'edited' | 'deleted';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  comment?: string;
  details?: any;
}