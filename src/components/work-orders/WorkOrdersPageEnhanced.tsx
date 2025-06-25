
import { useState } from "react";
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { useWorkOrdersPage } from "@/hooks/useWorkOrdersPage";
import { WorkOrdersHeader } from "./WorkOrdersHeader";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { WorkOrderCalendar } from "./WorkOrderCalendar";
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";

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
    <div className="h-full flex flex-col">
      {/* Header with view toggle */}
      <div className="border-b border-gray-200">
        <WorkOrdersHeader
          workOrdersCount={filteredWorkOrders.length}
          onCreateWorkOrder={handleCreateWorkOrder}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        {/* View Toggle */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              List View
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Calendar View
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'calendar' ? (
          <WorkOrderCalendar
            workOrders={filteredWorkOrders}
            onSelectWorkOrder={handleSelectWorkOrder}
            selectedWorkOrderId={selectedWorkOrder}
          />
        ) : (
          <WorkOrdersContent
            filteredWorkOrders={filteredWorkOrders}
            selectedWorkOrder={selectedWorkOrder}
            viewMode={formViewMode}
            selectedWorkOrderData={selectedWorkOrderData}
            editingWorkOrder={editingWorkOrder}
            onSelectWorkOrder={handleSelectWorkOrder}
            onEditWorkOrder={handleEditWorkOrder}
            onFormSubmit={handleFormSubmitWithRefresh}
            onFormCancel={handleFormCancel}
            onSetViewModeToList={setViewModeToList}
          />
        )}
      </div>
    </div>
  );
};
