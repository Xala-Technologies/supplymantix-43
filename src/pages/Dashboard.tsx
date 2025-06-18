import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { WorkOrdersDashboard } from "@/components/dashboard/WorkOrdersDashboard";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { WorkOrder } from "@/types/workOrder";
import { transformWorkOrderData } from "@/services/workOrderService";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  // Transform and use real data if available, otherwise use sample data
  const transformedWorkOrders: WorkOrder[] = workOrders?.length > 0 
    ? workOrders.map(transformWorkOrderData)
    : sampleWorkOrders;

  const handleCreateWorkOrder = async (data: any) => {
    setIsCreateLoading(true);
    try {
      // TODO: Implement actual work order creation
      console.log('Creating work order:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just add to sample data (in real app, this would trigger a refetch)
      const newWorkOrder: WorkOrder = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description || '',
        status: data.status || 'open',
        priority: data.priority || 'medium',
        category: data.category || 'maintenance',
        assignedTo: data.assignedTo || [],
        due_date: data.dueDate || new Date().toISOString(),
        asset: data.asset || { id: 'temp', name: 'General Asset', status: 'active' },
        location: data.location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant_id: 'sample-tenant',
        tags: [],
        time_spent: 0,
        total_cost: 0,
        parts_used: []
      };
      
      console.log('Work order created successfully:', newWorkOrder);
    } catch (error) {
      console.error('Failed to create work order:', error);
      throw error;
    } finally {
      setIsCreateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your maintenance overview.</p>
        </div>
        
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="flex-1 mt-6">
            <DashboardMetrics />
          </TabsContent>
          
          <TabsContent value="work-orders" className="flex-1 mt-6">
            <WorkOrdersDashboard
              workOrders={transformedWorkOrders}
              onCreateWorkOrder={handleCreateWorkOrder}
              isCreateLoading={isCreateLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
