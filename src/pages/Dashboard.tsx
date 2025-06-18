
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
    id: '5969',
    title: 'Wrapper Malfunction - Items Stuck on Belt',
    status: 'in_progress',
    dueDate: '2023-10-05T08:43:00Z',
    priority: 'high',
    assignedTo: ['Zach Brown'],
    description: 'The cutter is not fully cutting, and packages are either tearing away from the cutting assembly, or tipping over and causing stoppage.',
    asset: {
      id: 'wrapper-001',
      name: 'Wrapper - Orion Model A',
      status: 'active',
    },
    location: 'Production Line 3',
    category: 'equipment',
    timeSpent: 2.5,
    totalCost: 145.50,
    partsUsed: [
      { name: 'Cutting Blade', quantity: 1, cost: 25.00 },
      { name: 'Belt Assembly', quantity: 1, cost: 120.50 }
    ],
    createdAt: '2023-10-05T08:00:00Z',
    updatedAt: '2023-10-05T10:30:00Z'
  },
  {
    id: '5962',
    title: '[Safety] OSHA Compliance - Daily Site Walk',
    status: 'on_hold',
    dueDate: '2023-10-04T10:00:00Z',
    priority: 'medium',
    assignedTo: ['Safety Team'],
    description: 'Daily safety inspection and compliance check.',
    asset: {
      id: 'facility-001',
      name: 'Facility',
      status: 'active',
    },
    location: 'Entire Facility',
    category: 'safety',
    createdAt: '2023-10-04T08:00:00Z',
    updatedAt: '2023-10-04T09:00:00Z'
  },
  {
    id: '5960',
    title: '[Inspection] Wrapper Cleaning',
    status: 'in_progress',
    dueDate: '2023-10-06T14:00:00Z',
    priority: 'low',
    assignedTo: ['Maintenance Team 1'],
    description: 'Regular cleaning and maintenance of wrapper equipment.',
    asset: {
      id: 'wrapper-001',
      name: 'Wrapper - Orion Model A',
      status: 'active',
    },
    location: 'Production Line 3',
    category: 'maintenance',
    createdAt: '2023-10-06T08:00:00Z',
    updatedAt: '2023-10-06T10:00:00Z'
  },
  {
    id: '5983',
    title: 'Bearing Inspection',
    status: 'in_progress',
    dueDate: '2023-10-07T09:00:00Z',
    priority: 'high',
    assignedTo: ['Maintenance Team 1'],
    description: 'Inspection of conveyor bearing assembly.',
    asset: {
      id: 'conveyor-001',
      name: 'Conveyor - 3200 Series Modular',
      status: 'active',
    },
    location: 'Production Line 2',
    category: 'inspection',
    createdAt: '2023-10-07T08:00:00Z',
    updatedAt: '2023-10-07T08:30:00Z'
  },
  {
    id: '5988',
    title: 'Weekly Compressor PM',
    status: 'open',
    dueDate: '2023-10-08T16:00:00Z',
    priority: 'low',
    assignedTo: ['Maintenance Team 2'],
    description: 'Preventive maintenance for air compressor system.',
    asset: {
      id: 'compressor-001',
      name: '35-005 - Air Compressor - VSS Single Screw',
      status: 'active',
    },
    location: 'Utility Room',
    category: 'maintenance',
    createdAt: '2023-10-08T08:00:00Z',
    updatedAt: '2023-10-08T08:00:00Z'
  },
  {
    id: '5982',
    title: 'Fire Extinguisher Inspection',
    status: 'open',
    dueDate: '2023-10-09T11:00:00Z',
    priority: 'low',
    assignedTo: ['Safety Team'],
    description: 'Monthly fire extinguisher inspection and documentation.',
    asset: {
      id: 'extinguisher-001',
      name: 'ABC Fire Extinguisher (5 lb)',
      status: 'active',
    },
    location: 'Building A',
    category: 'safety',
    createdAt: '2023-10-09T08:00:00Z',
    updatedAt: '2023-10-09T08:00:00Z'
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
        dueDate: data.dueDate || new Date().toISOString(),
        asset: data.asset || { id: 'temp', name: 'General Asset', status: 'active' },
        location: data.location || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeSpent: 0,
        totalCost: 0,
        partsUsed: []
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
