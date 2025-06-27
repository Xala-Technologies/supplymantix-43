
import { EnhancedWorkOrdersList } from "./EnhancedWorkOrdersList";
import { EnhancedWorkOrderDetail } from "./EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "./EnhancedWorkOrderForm";
import { WorkOrdersEmptyState } from "./WorkOrdersEmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { SectionCard } from "@/components/Layout/SectionCard";

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
      {/* Left Panel - Consistent width and styling */}
      <div className="w-96 min-w-80 max-w-md border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="heading-2">Work Orders</h2>
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
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
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
                  className="mb-4 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to List
                </Button>
              </div>
              <SectionCard title={editingWorkOrder ? "Edit Work Order" : "Create Work Order"}>
                <EnhancedWorkOrderForm
                  workOrder={editingWorkOrder || undefined}
                  onSubmit={onFormSubmit}
                  onCancel={onFormCancel}
                />
              </SectionCard>
            </div>
          </div>
        )}
        
        {viewMode === 'list' && filteredWorkOrders.length === 0 && (
          <WorkOrdersEmptyState />
        )}
        
        {viewMode === 'list' && !selectedWorkOrder && filteredWorkOrders.length > 0 && (
          <div className="flex-1 flex items-center justify-center bg-gray-50/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded opacity-20"></div>
              </div>
              <h3 className="heading-3 mb-2">Select a Work Order</h3>
              <p className="text-sm text-slate-600">
                Choose a work order from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
