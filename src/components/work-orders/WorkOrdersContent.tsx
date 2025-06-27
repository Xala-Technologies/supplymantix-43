
import { Card } from "@/components/ui/card";
import { WorkOrdersCardView } from "./WorkOrdersCardView";
import { WorkOrdersListView } from "./WorkOrdersListView";
import { EnhancedWorkOrderDetail } from "./EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "./EnhancedWorkOrderForm";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersContentProps {
  filteredWorkOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  viewMode: 'list' | 'detail' | 'form';
  selectedWorkOrderData: WorkOrder | undefined;
  editingWorkOrder: WorkOrder | null;
  displayMode: 'card' | 'list';
  onSelectWorkOrder: (id: string) => void;
  onEditWorkOrder: () => void;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
  onSetViewModeToList: () => void;
}

export const WorkOrdersContent = (props: WorkOrdersContentProps) => {
  const { 
    displayMode, 
    filteredWorkOrders, 
    selectedWorkOrder, 
    viewMode,
    selectedWorkOrderData,
    editingWorkOrder,
    onSelectWorkOrder,
    onEditWorkOrder,
    onFormSubmit,
    onFormCancel,
    onSetViewModeToList
  } = props;

  // Show detail view when a work order is selected
  if (viewMode === 'detail' && selectedWorkOrderData) {
    return (
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <EnhancedWorkOrderDetail
            workOrder={selectedWorkOrderData}
            onEdit={onEditWorkOrder}
          />
        </div>
      </Card>
    );
  }

  // Show form view when creating or editing
  if (viewMode === 'form') {
    return (
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <EnhancedWorkOrderForm
            workOrder={editingWorkOrder}
            onSubmit={onFormSubmit}
            onCancel={onFormCancel}
          />
        </div>
      </Card>
    );
  }

  // Default list view - show cards or list
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {displayMode === 'card' ? (
          <WorkOrdersCardView
            workOrders={filteredWorkOrders}
            onSelectWorkOrder={onSelectWorkOrder}
            selectedWorkOrderId={selectedWorkOrder}
          />
        ) : (
          <WorkOrdersListView
            workOrders={filteredWorkOrders}
            onSelectWorkOrder={onSelectWorkOrder}
            selectedWorkOrderId={selectedWorkOrder}
          />
        )}
      </div>
    </Card>
  );
};
