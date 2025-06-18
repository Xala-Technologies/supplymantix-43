
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { WorkOrderListPage } from "@/components/work-orders/WorkOrderListPage";
import { NewWorkOrderDialog } from "@/components/work-orders/NewWorkOrderDialog";
import { WorkOrderDetailCard } from "@/components/work-orders/WorkOrderDetailCard";

export default function WorkOrders() {
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateWorkOrder = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrderId(id);
  };

  const handleWorkOrderCreated = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex gap-6">
        {/* Work Orders List */}
        <div className="flex-1">
          <WorkOrderListPage
            onCreateWorkOrder={handleCreateWorkOrder}
            onSelectWorkOrder={handleSelectWorkOrder}
            selectedWorkOrderId={selectedWorkOrderId}
          />
        </div>

        {/* Work Order Detail Panel */}
        {selectedWorkOrderId && (
          <div className="w-96 flex-shrink-0">
            <WorkOrderDetailCard
              workOrderId={selectedWorkOrderId}
              onClose={() => setSelectedWorkOrderId(null)}
            />
          </div>
        )}
      </div>

      {/* Create Work Order Dialog */}
      <NewWorkOrderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onWorkOrderCreated={handleWorkOrderCreated}
      />
    </DashboardLayout>
  );
}
