
import { EnhancedWorkOrdersList } from "./EnhancedWorkOrdersList";
import { EnhancedWorkOrderDetail } from "./EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "./EnhancedWorkOrderForm";
import { WorkOrdersEmptyState } from "./WorkOrdersEmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrdersDesktopLayoutProps {
  filteredWorkOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  viewMode: 'list' | 'detail' | 'form';
  selectedWorkOrderData: WorkOrder | undefined;
  editingWorkOrder: WorkOrder | null;
  onSelectWorkOrder: (id: string) => void;
  onEditWorkOrder: () => void;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
}

export const WorkOrdersDesktopLayout = ({
  filteredWorkOrders,
  selectedWorkOrder,
  viewMode,
  selectedWorkOrderData,
  editingWorkOrder,
  onSelectWorkOrder,
  onEditWorkOrder,
  onFormSubmit,
  onFormCancel
}: WorkOrdersDesktopLayoutProps) => {
  return (
    <div className="hidden lg:flex h-full w-full">
      {/* Left Panel - 30% */}
      <div className="w-[30%] border-r border-gray-200">
        <EnhancedWorkOrdersList 
          workOrders={filteredWorkOrders}
          selectedWorkOrderId={selectedWorkOrder}
          onSelectWorkOrder={onSelectWorkOrder}
        />
      </div>
      
      {/* Main Content Area - 70% */}
      <div className="w-[70%] flex flex-col overflow-hidden">
        {viewMode === 'detail' && selectedWorkOrderData && (
          <EnhancedWorkOrderDetail 
            workOrder={selectedWorkOrderData}
            onEdit={onEditWorkOrder}
          />
        )}
        
        {viewMode === 'form' && (
          <div className="h-full overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={onFormCancel}
                  className="mb-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
              <EnhancedWorkOrderForm
                workOrder={editingWorkOrder || undefined}
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
              />
            </div>
          </div>
        )}
        
        {/* Only show empty state if no work orders exist */}
        {viewMode === 'list' && filteredWorkOrders.length === 0 && (
          <WorkOrdersEmptyState />
        )}
      </div>
    </div>
  );
};
