
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { EnhancedWorkOrdersList } from "@/components/work-orders/EnhancedWorkOrdersList";
import { WorkOrderDetailCard } from "@/components/work-orders/WorkOrderDetailCard";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkOrder } from "@/types/workOrder";
import { transformWorkOrderData } from "@/services/workOrderService";

// Sample data for demonstration
const sampleWorkOrders: WorkOrder[] = [
  {
    id: '5969',
    title: 'Wrapper Malfunction - Items Stuck on Belt',
    status: 'in_progress',
    due_date: '2023-10-05T08:43:00Z',
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
    time_spent: 2.5,
    total_cost: 145.50,
    parts_used: [
      { name: 'Cutting Blade', quantity: 1, cost: 25.00 },
      { name: 'Belt Assembly', quantity: 1, cost: 120.50 }
    ],
    created_at: '2023-10-05T08:00:00Z',
    updated_at: '2023-10-05T10:30:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['urgent', 'production']
  },
  {
    id: '5962',
    title: '[Safety] OSHA Compliance - Daily Site Walk',
    status: 'on_hold',
    due_date: '2023-10-04T10:00:00Z',
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
    created_at: '2023-10-04T08:00:00Z',
    updated_at: '2023-10-04T09:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['safety', 'compliance']
  },
  {
    id: '5960',
    title: '[Inspection] Wrapper Cleaning',
    status: 'in_progress',
    due_date: '2023-10-06T14:00:00Z',
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
    created_at: '2023-10-06T08:00:00Z',
    updated_at: '2023-10-06T10:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['maintenance', 'scheduled']
  }
];

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useWorkOrdersIntegration();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>('5969');

  // Transform and use real data if available, otherwise use sample data
  const transformedWorkOrders: WorkOrder[] = workOrders?.length > 0 
    ? workOrders.map(transformWorkOrderData)
    : sampleWorkOrders;

  const selectedWorkOrderData = transformedWorkOrders.find(wo => wo.id === selectedWorkOrder) || transformedWorkOrders[0];

  const handleCreateWorkOrder = () => {
    console.log('Create new work order');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground text-sm">Loading work orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full -m-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full">
          {/* Left Sidebar - Work Orders List */}
          <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
            <EnhancedWorkOrdersList 
              workOrders={transformedWorkOrders}
              selectedWorkOrderId={selectedWorkOrder}
              onSelectWorkOrder={setSelectedWorkOrder}
              onCreateWorkOrder={handleCreateWorkOrder}
            />
          </div>
          
          {/* Main Content Area - Work Order Details */}
          <div className="flex-1 flex flex-col">
            {selectedWorkOrderData ? (
              <div className="h-full overflow-auto bg-gray-50">
                <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-3 p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">Select a work order</h3>
                    <p className="text-sm text-gray-500">Choose a work order from the list to view details</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden h-full">
          {!selectedWorkOrder ? (
            <div className="h-full bg-white">
              <div className="p-4 border-b border-gray-100">
                <h1 className="text-xl font-semibold text-gray-900">Work Orders</h1>
                <p className="text-gray-600 text-sm mt-0.5">Manage and track maintenance work orders</p>
              </div>
              <EnhancedWorkOrdersList 
                workOrders={transformedWorkOrders}
                selectedWorkOrderId={selectedWorkOrder}
                onSelectWorkOrder={setSelectedWorkOrder}
                onCreateWorkOrder={handleCreateWorkOrder}
              />
            </div>
          ) : (
            <div className="h-full bg-white flex flex-col">
              {/* Mobile Header */}
              <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedWorkOrder(null)}
                  className="p-1.5 h-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate text-sm">
                    {selectedWorkOrderData?.title || `Work Order #${selectedWorkOrder}`}
                  </h2>
                  <p className="text-xs text-gray-500">#{selectedWorkOrder}</p>
                </div>
              </div>
              
              {/* Mobile Content */}
              <div className="flex-1 overflow-auto">
                {selectedWorkOrderData && (
                  <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
