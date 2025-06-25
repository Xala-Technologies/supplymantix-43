
import { useState } from "react";
import { useWorkOrdersIntegration } from "@/features/workOrders/hooks/useWorkOrdersIntegration";
import { useWorkOrdersPage } from "@/hooks/useWorkOrdersPage";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { WorkOrderCalendarView } from "./WorkOrderCalendarView";
import { Card } from "@/components/ui/card";

export const WorkOrdersPage = () => {
  const { data: workOrders, isLoading, error } = useWorkOrdersIntegration();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  const {
    selectedWorkOrder,
    viewMode: pageViewMode,
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

  return (
    <div className="h-full p-6 bg-gray-50/30">
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b bg-white">
          <WorkOrdersTopHeader
            workOrdersCount={filteredWorkOrders.length}
            totalCount={transformedWorkOrders.length}
            filters={filters}
            onFiltersChange={setFilters}
            onCreateWorkOrder={handleCreateWorkOrder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'calendar' ? (
            <div className="h-full p-6">
              <div className="h-full bg-white rounded-lg shadow-sm border overflow-hidden">
                <WorkOrderCalendarView
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              </div>
            </div>
          ) : (
            <WorkOrdersContent
              filteredWorkOrders={filteredWorkOrders}
              selectedWorkOrder={selectedWorkOrder}
              viewMode={pageViewMode}
              selectedWorkOrderData={selectedWorkOrderData}
              editingWorkOrder={editingWorkOrder}
              onSelectWorkOrder={handleSelectWorkOrder}
              onEditWorkOrder={handleEditWorkOrder}
              onFormSubmit={handleFormSubmit}
              onFormCancel={handleFormCancel}
              onSetViewModeToList={setViewModeToList}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
