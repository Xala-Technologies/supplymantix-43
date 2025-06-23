
import { EnhancedWorkOrdersList } from "./EnhancedWorkOrdersList";
import { EnhancedWorkOrderDetail } from "./EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "./EnhancedWorkOrderForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersMobileLayoutProps {
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

export const WorkOrdersMobileLayout = ({
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
}: WorkOrdersMobileLayoutProps) => {
  return (
    <div className="lg:hidden h-full w-full">
      {viewMode === 'list' && (
        <div className="h-full">
          <EnhancedWorkOrdersList 
            workOrders={filteredWorkOrders}
            selectedWorkOrderId={selectedWorkOrder}
            onSelectWorkOrder={onSelectWorkOrder}
          />
        </div>
      )}
      
      {viewMode === 'detail' && selectedWorkOrderData && (
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-100 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSetViewModeToList}
              className="p-1.5 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate text-sm">
                {selectedWorkOrderData.title}
              </h2>
              <p className="text-xs text-gray-500">#{selectedWorkOrder}</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <EnhancedWorkOrderDetail 
              workOrder={selectedWorkOrderData}
              onEdit={onEditWorkOrder}
            />
          </div>
        </div>
      )}
      
      {viewMode === 'form' && (
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-100 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onFormCancel}
              className="p-1.5 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold text-gray-900 text-sm">
              {editingWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <EnhancedWorkOrderForm
                workOrder={editingWorkOrder || undefined}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
