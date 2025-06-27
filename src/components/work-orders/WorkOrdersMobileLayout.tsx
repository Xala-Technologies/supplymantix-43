
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
    <div className="lg:hidden h-full w-full flex flex-col">
      {viewMode === 'list' && (
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b border-gray-100">
            <h1 className="heading-2">Work Orders</h1>
            <p className="text-sm text-slate-600 mt-1">
              {filteredWorkOrders.length} {filteredWorkOrders.length === 1 ? 'order' : 'orders'}
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <EnhancedWorkOrdersList 
              workOrders={filteredWorkOrders}
              selectedWorkOrderId={selectedWorkOrder}
              onSelectWorkOrder={onSelectWorkOrder}
            />
          </div>
        </div>
      )}
      
      {viewMode === 'detail' && selectedWorkOrderData && (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSetViewModeToList}
              className="p-2 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="heading-3 truncate">
                {selectedWorkOrderData.title}
              </h2>
              <p className="text-xs text-slate-500">#{selectedWorkOrder}</p>
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
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onFormCancel}
              className="p-2 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="heading-3">
              {editingWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <EnhancedWorkOrderForm
              workOrder={editingWorkOrder || undefined}
              onSubmit={onFormSubmit}
              onCancel={onFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};
