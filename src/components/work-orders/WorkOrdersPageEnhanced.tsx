
import { useState } from "react";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { useWorkOrdersPage } from "@/hooks/useWorkOrdersPage";
import { WorkOrderViewToggle } from "./WorkOrderViewToggle";
import { WorkOrderCalendar } from "./WorkOrderCalendar";
import { EnhancedWorkOrdersList } from "./EnhancedWorkOrdersList";
import { WorkOrderDetailPanel } from "./WorkOrderDetailPanel";
import { WorkOrderForm } from "./WorkOrderForm";
import { Card } from "@/components/ui/card";

export const WorkOrdersPageEnhanced = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { data: workOrders, isLoading, refetch, error } = useWorkOrdersIntegration();
  
  const {
    selectedWorkOrder,
    viewMode: formViewMode,
    editingWorkOrder,
    filters,
    setFilters,
    transformedWorkOrders,
    filteredWorkOrders,
    selectedWorkOrderData,
    handleCreateWorkOrder,
    handleEditWorkOrder,
    handleSelectWorkOrder,
    handleFormSubmit,
    handleFormCancel,
    setViewModeToList
  } = useWorkOrdersPage(workOrders || []);

  const handleFormSubmitWithRefresh = async (data: any) => {
    await handleFormSubmit(data);
    await refetch();
  };

  const handleStatusUpdate = async (status: string) => {
    // This would call an API to update the status
    console.log('Updating status to:', status);
    await refetch();
  };

  if (error) {
    console.error('Work orders page error:', error);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading work orders...</p>
        </div>
      </div>
    );
  }

  // If in form mode, show the form
  if (formViewMode === 'form') {
    return (
      <div className="h-full bg-gray-50">
        <WorkOrderForm
          initialData={editingWorkOrder}
          onSubmit={handleFormSubmitWithRefresh}
          onCancel={handleFormCancel}
          mode={editingWorkOrder ? 'edit' : 'create'}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <WorkOrderViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
        workOrdersCount={filteredWorkOrders.length}
        onCreateWorkOrder={handleCreateWorkOrder}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Panel - List or Calendar */}
          <div className="w-1/2 border-r border-gray-200">
            <Card className="h-full rounded-none border-0">
              {viewMode === 'calendar' ? (
                <WorkOrderCalendar
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              ) : (
                <EnhancedWorkOrdersList
                  workOrders={filteredWorkOrders}
                  selectedWorkOrderId={selectedWorkOrder}
                  onSelectWorkOrder={handleSelectWorkOrder}
                />
              )}
            </Card>
          </div>

          {/* Right Panel - Work Order Details */}
          <div className="flex-1">
            {selectedWorkOrderData ? (
              <WorkOrderDetailPanel
                workOrder={selectedWorkOrderData}
                onEdit={handleEditWorkOrder}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Work Order
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose a work order from the {viewMode} to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
