
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
  },
  {
    id: '5983',
    title: 'Bearing Inspection',
    status: 'in_progress',
    due_date: '2023-10-07T09:00:00Z',
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
    created_at: '2023-10-07T08:00:00Z',
    updated_at: '2023-10-07T08:30:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['inspection', 'bearing']
  },
  {
    id: '5988',
    title: 'Weekly Compressor PM',
    status: 'open',
    due_date: '2023-10-08T16:00:00Z',
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
    created_at: '2023-10-08T08:00:00Z',
    updated_at: '2023-10-08T08:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['pm', 'weekly']
  },
  {
    id: '5982',
    title: 'Fire Extinguisher Inspection',
    status: 'open',
    due_date: '2023-10-09T11:00:00Z',
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
    created_at: '2023-10-09T08:00:00Z',
    updated_at: '2023-10-09T08:00:00Z',
    tenant_id: 'sample-tenant-id',
    tags: ['safety', 'monthly']
  },
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
    // TODO: Open create work order dialog
    console.log('Create new work order');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading work orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Mobile-only header */}
        <div className="md:hidden p-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">Manage and track maintenance work orders</p>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex w-full">
            {/* Sidebar */}
            <EnhancedWorkOrdersList 
              workOrders={transformedWorkOrders}
              selectedWorkOrderId={selectedWorkOrder}
              onSelectWorkOrder={setSelectedWorkOrder}
              onCreateWorkOrder={handleCreateWorkOrder}
            />
            
            {/* Detail view */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-6">
                {selectedWorkOrderData ? (
                  <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📋</span>
                      </div>
                      <p className="text-lg font-medium">Select a work order</p>
                      <p className="text-sm text-gray-400">Choose a work order from the list to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden w-full flex flex-col">
            {!selectedWorkOrder ? (
              <EnhancedWorkOrdersList 
                workOrders={transformedWorkOrders}
                selectedWorkOrderId={selectedWorkOrder}
                onSelectWorkOrder={setSelectedWorkOrder}
                onCreateWorkOrder={handleCreateWorkOrder}
              />
            ) : (
              <>
                {/* Mobile header with back button */}
                <div className="p-3 border-b bg-white flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedWorkOrder(null)}
                    className="p-1 h-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 truncate block">
                      {selectedWorkOrderData?.title || `Work Order #${selectedWorkOrder}`}
                    </span>
                    <span className="text-sm text-gray-500">
                      #{selectedWorkOrder}
                    </span>
                  </div>
                </div>
                
                {/* Mobile detail view */}
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                  {selectedWorkOrderData && (
                    <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
