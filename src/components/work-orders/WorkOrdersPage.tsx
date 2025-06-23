
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { useWorkOrdersPage } from "@/hooks/useWorkOrdersPage";

export const WorkOrdersPage = () => {
  const { data: workOrders, isLoading } = useWorkOrdersIntegration();
  
  const {
    selectedWorkOrder,
    viewMode,
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
    <div className="h-full flex flex-col w-full bg-gray-50/30">
      {/* Top Header */}
      <WorkOrdersTopHeader
        workOrdersCount={filteredWorkOrders.length}
        totalCount={transformedWorkOrders.length}
        filters={filters}
        onFiltersChange={setFilters}
        onCreateWorkOrder={handleCreateWorkOrder}
      />

      {/* Main Content - Single Card */}
      <WorkOrdersContent
        filteredWorkOrders={filteredWorkOrders}
        selectedWorkOrder={selectedWorkOrder}
        viewMode={viewMode}
        selectedWorkOrderData={selectedWorkOrderData}
        editingWorkOrder={editingWorkOrder}
        onSelectWorkOrder={handleSelectWorkOrder}
        onEditWorkOrder={handleEditWorkOrder}
        onFormSubmit={handleFormSubmit}
        onFormCancel={handleFormCancel}
        onSetViewModeToList={setViewModeToList}
      />
    </div>
  );
};
