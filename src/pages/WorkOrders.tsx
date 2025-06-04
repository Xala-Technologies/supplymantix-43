
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { WorkOrderDetailCard } from "@/components/work-orders/WorkOrderDetailCard";

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useWorkOrders();

  const sampleWorkOrder = {
    id: '5969',
    title: 'Wrapper Malfunction - Items Stuck on Belt',
    status: 'In Progress',
    dueDate: '2023-10-05T08:43:00Z',
    priority: 'High',
    assignedTo: ['Zach Brown', 'Maintenance Team 1', 'Operations', 'Safety'],
    description:
      'The cutter is not fully cutting, and packages are either tearing away from the cutting assembly, or tipping over and causing stoppage.',
    asset: {
      name: 'Wrapper - Orion Model A',
      status: 'Online',
    },
    location: 'Production Line 3',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
          <p className="text-gray-600 mt-1">Manage maintenance work orders and tasks</p>
        </div>
        
        <WorkOrderDetailCard workOrder={sampleWorkOrder} />
      </div>
    </DashboardLayout>
  );
}
