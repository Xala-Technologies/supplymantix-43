
import { Card } from "@/components/ui/card";
import { WorkOrdersCardView } from "./WorkOrdersCardView";
import { WorkOrdersListView } from "./WorkOrdersListView";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersContentProps {
  filteredWorkOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  viewMode: 'list' | 'detail' | 'form';
  selectedWorkOrderData: WorkOrder | undefined;
  editingWorkOrder: WorkOrder | null;
  displayMode: 'card' | 'list'; // Add this prop for card/list toggle
  onSelectWorkOrder: (id: string) => void;
  onEditWorkOrder: () => void;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
  onSetViewModeToList: () => void;
}

export const WorkOrdersContent = (props: WorkOrdersContentProps) => {
  const { displayMode, filteredWorkOrders, selectedWorkOrder, onSelectWorkOrder } = props;

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
