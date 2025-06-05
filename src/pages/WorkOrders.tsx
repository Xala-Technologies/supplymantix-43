
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { WorkOrdersList } from "@/components/work-orders/WorkOrdersList";
import { WorkOrderDetailCard } from "@/components/work-orders/WorkOrderDetailCard";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Transform the data to match the WorkOrdersList expected interface
const transformWorkOrderData = (workOrder: any) => ({
  id: workOrder.id,
  title: workOrder.title,
  status: workOrder.status,
  dueDate: workOrder.due_date || new Date().toISOString(),
  priority: workOrder.priority || 'medium',
  assignedTo: workOrder.assigned_to ? [workOrder.assigned_to] : [],
  description: workOrder.description || '',
  asset: {
    name: workOrder.asset?.name || 'Unknown Asset',
    status: workOrder.asset?.status || 'active',
  },
  location: workOrder.locations?.name || 'Unknown Location',
  category: workOrder.category || 'maintenance',
  time_spent: workOrder.time_spent || 0,
  total_cost: workOrder.total_cost || 0,
  parts_used: workOrder.partsUsed || []
});

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useWorkOrdersIntegration();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>('5969');

  // Transform the work orders data to match expected interface
  const transformedWorkOrders = workOrders?.map(transformWorkOrderData) || [];

  // Use sample data if no real data is available yet
  const sampleWorkOrders = [
    {
      id: '5969',
      title: 'Wrapper Malfunction - Items Stuck on Belt',
      status: 'in_progress',
      dueDate: '2023-10-05T08:43:00Z',
      priority: 'high',
      assignedTo: ['Zach Brown'],
      description: 'The cutter is not fully cutting, and packages are either tearing away from the cutting assembly, or tipping over and causing stoppage.',
      asset: {
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
      ]
    },
    {
      id: '5962',
      title: '[Safety] OSHA Compliance - Daily Site Walk',
      status: 'On Hold',
      dueDate: '2023-10-04T10:00:00Z',
      priority: 'Medium',
      assignedTo: ['Safety Team'],
      description: 'Daily safety inspection and compliance check.',
      asset: {
        name: 'Facility',
        status: 'Online',
      },
      location: 'Entire Facility',
      category: 'Safety',
    },
    {
      id: '5960',
      title: '[Inspection] Wrapper Cleaning',
      status: 'In Progress',
      dueDate: '2023-10-06T14:00:00Z',
      priority: 'Low',
      assignedTo: ['Maintenance Team 1'],
      description: 'Regular cleaning and maintenance of wrapper equipment.',
      asset: {
        name: 'Wrapper - Orion Model A',
        status: 'Online',
      },
      location: 'Production Line 3',
      category: 'Maintenance',
    },
    {
      id: '5983',
      title: 'Bearing Inspection',
      status: 'In Progress',
      dueDate: '2023-10-07T09:00:00Z',
      priority: 'High',
      assignedTo: ['Maintenance Team 1'],
      description: 'Inspection of conveyor bearing assembly.',
      asset: {
        name: 'Conveyor - 3200 Series Modular',
        status: 'Online',
      },
      location: 'Production Line 2',
      category: 'Inspection',
    },
    {
      id: '5988',
      title: 'Weekly Compressor PM',
      status: 'Open',
      dueDate: '2023-10-08T16:00:00Z',
      priority: 'Low',
      assignedTo: ['Maintenance Team 2'],
      description: 'Preventive maintenance for air compressor system.',
      asset: {
        name: '35-005 - Air Compressor - VSS Single Screw',
        status: 'Online',
      },
      location: 'Utility Room',
      category: 'PM',
    },
    {
      id: '5982',
      title: 'Fire Extinguisher Inspection',
      status: 'Open',
      dueDate: '2023-10-09T11:00:00Z',
      priority: 'Low',
      assignedTo: ['Safety Team'],
      description: 'Monthly fire extinguisher inspection and documentation.',
      asset: {
        name: 'ABC Fire Extinguisher (5 lb)',
        status: 'Online',
      },
      location: 'Building A',
      category: 'Safety',
    },
  ];

  const displayWorkOrders = transformedWorkOrders.length > 0 ? transformedWorkOrders : sampleWorkOrders;
  const selectedWorkOrderData = displayWorkOrders.find(wo => wo.id === selectedWorkOrder) || displayWorkOrders[0];

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        <div className="p-4 bg-white border-b">
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">Manage and track maintenance work orders</p>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex w-full">
            {/* Sidebar */}
            <WorkOrdersList 
              workOrders={displayWorkOrders}
              selectedWorkOrderId={selectedWorkOrder}
              onSelectWorkOrder={setSelectedWorkOrder}
            />
            
            {/* Detail view */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-4 lg:p-6">
                <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden w-full flex flex-col">
            {!selectedWorkOrder ? (
              <WorkOrdersList 
                workOrders={displayWorkOrders}
                selectedWorkOrderId={selectedWorkOrder}
                onSelectWorkOrder={setSelectedWorkOrder}
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
                  <span className="font-medium text-gray-900 truncate">
                    Work Order #{selectedWorkOrderData.id}
                  </span>
                </div>
                
                {/* Mobile detail view */}
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                  <WorkOrderDetailCard workOrder={selectedWorkOrderData} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
