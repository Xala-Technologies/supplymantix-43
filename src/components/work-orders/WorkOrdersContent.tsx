
import { Card } from "@/components/ui/card";
import { WorkOrdersDesktopLayout } from "./WorkOrdersDesktopLayout";
import { WorkOrdersMobileLayout } from "./WorkOrdersMobileLayout";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersContentProps {
  filteredWorkOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  viewMode: 'list' | 'detail' | 'form';
  selectedWorkOrderData: WorkOrder | undefined;
  editingWorkOrder: WorkOrder | null;
  onSelectWorkOrder: (id: string) => void;
  onEditWorkOrder: () => void;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
  onSetViewModeToList: () => void;
}

export const WorkOrdersContent = (props: WorkOrdersContentProps) => {
  return (
    <div className="flex-1 p-6">
      <Card className="h-full flex overflow-hidden">
        <WorkOrdersDesktopLayout {...props} />
        <WorkOrdersMobileLayout {...props} />
      </Card>
    </div>
  );
};
