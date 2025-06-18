
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
        <div className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading work orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Mobile-only header */}
        <div className="md:hidden">
          <h1 className="text-2xl font-semibold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track maintenance work orders</p>
        </div>
        
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex w-full gap-6">
            {/* Sidebar */}
            <div className="w-96 flex-shrink-0">
              <EnhancedWorkOrdersList 
                workOrders={transformedWorkOrders}
                selectedWorkOrderId={selectedWorkOrder}
                onSelectWorkOrder={setSelectedWorkOrder}
                onCreateWorkOrder={handleCreateWorkOrder}
              />
            </div>
            
            {/* Detail view */}
            <div className="flex-1 bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="h-full overflow-y-auto">
                {selectedWorkOrderData ? (
                  <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto">
                        <span className="text-2xl">📋</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Select a work order</h3>
                        <p className="text-sm text-muted-foreground">Choose a work order from the list to view details</p>
                      </div>
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
              <div className="space-y-4">
                {/* Mobile header with back button */}
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedWorkOrder(null)}
                    className="p-2 h-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h2 className="font-medium truncate">
                      {selectedWorkOrderData?.title || `Work Order #${selectedWorkOrder}`}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      #{selectedWorkOrder}
                    </p>
                  </div>
                </div>
                
                {/* Mobile detail view */}
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  {selectedWorkOrderData && (
                    <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
