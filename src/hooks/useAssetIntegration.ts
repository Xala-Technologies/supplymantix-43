import { useQuery } from "@tanstack/react-query";

interface Asset {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "maintenance";
  location?: string;
  category?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "on_hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  assigned_to: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  category: string;
  tags: string[];
}

const mockAssets: Asset[] = [
  {
    id: "asset-001",
    name: "Production Line A",
    description: "Main production line for product X",
    status: "active",
    location: "Factory Floor",
    category: "production",
    tenant_id: "tenant-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "asset-002",
    name: "HVAC System - Building B",
    description: "Heating, ventilation, and air conditioning system",
    status: "active",
    location: "Building B - Utility Room",
    category: "hvac",
    tenant_id: "tenant-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "asset-003",
    name: "Conveyor Belt System",
    description: "Automated conveyor system for moving products",
    status: "maintenance",
    location: "Factory Floor - Section 3",
    category: "conveyor",
    tenant_id: "tenant-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockWorkOrders = [
  {
    id: "wo-001",
    title: "Monthly Preventive Maintenance",
    description: "Routine maintenance check for optimal performance",
    status: "open" as const,
    priority: "medium" as const,
    assigned_to: "maintenance-team-1",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "tenant-1",
    category: "maintenance",
    tags: ["routine", "monthly"]
  },
  {
    id: "wo-002",
    title: "Repair - Conveyor Belt Slipping",
    description: "Conveyor belt is slipping, causing production delays",
    status: "in_progress" as const,
    priority: "high" as const,
    assigned_to: "maintenance-team-2",
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "tenant-1",
    category: "repair",
    tags: ["urgent", "conveyor"]
  },
  {
    id: "wo-003",
    title: "HVAC Filter Replacement",
    description: "Replace filters in the HVAC system",
    status: "completed" as const,
    priority: "medium" as const,
    assigned_to: "hvac-team-1",
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant_id: "tenant-1",
    category: "hvac",
    tags: ["hvac", "filter"]
  },
];

interface UseAssetsResult {
  assets: Asset[];
  loading: boolean;
  error: any;
}

export const useAssetsIntegration = (): UseAssetsResult => {
  const { data, isLoading, error } = useQuery<Asset[]>(
    "assets",
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockAssets);
        }, 500);
      });
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    assets: data || [],
    loading: isLoading,
    error,
  };
};

interface UseWorkOrdersResult {
  workOrders: WorkOrder[];
  loading: boolean;
  error: any;
}

export const useWorkOrdersIntegration = (): UseWorkOrdersResult => {
  const { data, isLoading, error } = useQuery<WorkOrder[]>(
    "workOrders",
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockWorkOrders);
        }, 500);
      });
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    workOrders: data || [],
    loading: isLoading,
    error,
  };
};
