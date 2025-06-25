
import { EnhancedWorkOrdersList } from "./EnhancedWorkOrdersList";
import { EnhancedWorkOrderDetail } from "./EnhancedWorkOrderDetail";
import { EnhancedWorkOrderForm } from "./EnhancedWorkOrderForm";
import { WorkOrdersEmptyState } from "./WorkOrdersEmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { Card, CardContent } from "@/components/ui/card";

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
      {/* Left Panel - Work Orders List */}
      <div className="w-[400px] border-r border-gray-200 bg-white flex-shrink-0">
        <EnhancedWorkOrdersList 
          workOrders={filteredWorkOrders}
          selectedWorkOrderId={selectedWorkOrder}
          onSelectWorkOrder={onSelectWorkOrder}
        />
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
        
        {/* Default state when no work order is selected */}
        {viewMode === 'list' && !selectedWorkOrder && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="w-96 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Work Order
                </h3>
                <p className="text-gray-600">
                  Choose a work order from the list to view its details and manage it.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Empty state when no work orders exist */}
        {filteredWorkOrders.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <WorkOrdersEmptyState />
          </div>
        )}
      </div>
    </div>
  );
};
