import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { EnhancedDashboardMetrics } from "@/components/dashboard/EnhancedDashboardMetrics";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { useAuth } from "@/contexts/AuthContext";
import { WorkOrder } from "@/types/workOrder";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Sample data for demonstration
const sampleWorkOrders: WorkOrder[] = [
  {
    id: '1',
    title: 'Emergency Repair - Production Line A',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: ['John Doe'],
    asset: {
      id: 'asset-1',
      name: 'Production Line A',
      status: 'active'
    },
    due_date: '2023-12-20T16:00:00Z',
    category: 'emergency',
    created_at: '2023-12-18T09:00:00Z',
    updated_at: '2023-12-18T14:30:00Z',
    tenant_id: 'sample-tenant',
    tags: ['emergency']
  },
  {
    id: '2',
    title: 'Scheduled Maintenance - HVAC System',
    status: 'open',
    priority: 'medium',
    assignedTo: ['Jane Smith'],
    asset: {
      id: 'asset-2', 
      name: 'HVAC System',
      status: 'active'
    },
    due_date: '2023-12-22T10:00:00Z',
    category: 'maintenance',
    created_at: '2023-12-18T08:00:00Z',
    updated_at: '2023-12-18T08:00:00Z',
    tenant_id: 'sample-tenant',
    tags: ['scheduled']
  },
  {
    id: '3',
    title: 'Inspection - Safety Equipment',
    status: 'completed',
    priority: 'low',
    assignedTo: ['Bob Wilson'],
    asset: {
      id: 'asset-3',
      name: 'Safety Equipment',
      status: 'active'
    },
    due_date: '2023-12-19T14:00:00Z',
    category: 'inspection',
    created_at: '2023-12-17T10:00:00Z',
    updated_at: '2023-12-19T15:00:00Z',
    tenant_id: 'sample-tenant',
    tags: ['safety']
  },
  {
    id: '4',
    title: 'Calibration - Measurement Tools',
    status: 'on_hold',
    priority: 'medium',
    assignedTo: ['Alice Johnson'],
    asset: {
      id: 'asset-4',
      name: 'Measurement Tools',
      status: 'active'
    },
    due_date: '2023-12-25T11:00:00Z',
    category: 'calibration',
    created_at: '2023-12-18T11:00:00Z',
    updated_at: '2023-12-18T13:00:00Z',
    tenant_id: 'sample-tenant',
    tags: ['calibration']
  },
  {
    id: '5',
    title: 'Repair - Conveyor Belt',
    status: 'open',
    priority: 'high',
    assignedTo: ['Mike Brown'],
    asset: {
      id: 'asset-5',
      name: 'Conveyor Belt',
      status: 'active'
    },
    due_date: '2023-12-21T13:00:00Z',
    category: 'repair',
    created_at: '2023-12-18T12:00:00Z',
    updated_at: '2023-12-18T12:00:00Z',
    tenant_id: 'sample-tenant',
    tags: ['repair']
  },
  {
    id: '6',
    title: 'Preventive Maintenance - Generator',
    status: 'draft',
    priority: 'low',
    assignedTo: ['Sarah Davis'],
    asset: {
      id: 'asset-6',
      name: 'Backup Generator',
      status: 'active'
    },
    due_date: '2023-12-28T09:00:00Z',
    category: 'maintenance',
    created_at: '2023-12-18T15:00:00Z',
    updated_at: '2023-12-18T15:00:00Z',
    tenant_id: 'sample-tenant',
    tags: ['preventive']
  },
];

export default function Dashboard() {
  const { data: workOrders, isLoading } = useWorkOrdersIntegration();
  const { user, loading: authLoading } = useAuth();
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const navigate = useNavigate();

  // Transform and use real data if available, otherwise use sample data
  const transformedWorkOrders: WorkOrder[] = workOrders?.length > 0 
    ? workOrders
    : sampleWorkOrders;

  const handleCreateWorkOrder = async () => {
    navigate('/dashboard/work-orders');
  };

  const handleScheduleProcedure = () => {
    navigate('/dashboard/procedures');
  };

  const handleAddAsset = () => {
    navigate('/dashboard/assets');
  };

  const handleInviteUser = () => {
    navigate('/dashboard/organization');
  };

  console.log('Dashboard rendering, authLoading:', authLoading, 'user:', user?.email, 'isLoading:', isLoading, 'workOrders:', workOrders);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show loading while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-slate-600">Loading dashboard data...</p>
            </div>
          </div>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageHeader 
          title="Dashboard"
          description="Overview of your maintenance operations"
        />
        <StandardPageContent>
          <EnhancedDashboardMetrics
            onCreateWorkOrder={handleCreateWorkOrder}
            onScheduleProcedure={handleScheduleProcedure}
            onAddAsset={handleAddAsset}
            onInviteUser={handleInviteUser}
          />
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
}
