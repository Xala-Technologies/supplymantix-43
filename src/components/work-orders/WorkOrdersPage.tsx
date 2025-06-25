
import { useWorkOrdersIntegration } from "@/hooks/useWorkOrdersIntegration";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { useWorkOrdersPage } from "@/hooks/useWorkOrdersPage";

export const WorkOrdersPage = () => {
  const { data: workOrders, isLoading, refetch, error } = useWorkOrdersIntegration();
  
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

  // Enhanced form submit handler that refreshes data
  const handleFormSubmitWithRefresh = async (data: any) => {
    console.log('Submitting work order with refresh...');
    await handleFormSubmit(data);
    
    // Force refetch the data to update the list
    console.log('Refetching work orders after submit...');
    await refetch();
    
    console.log('Work order submission and refresh completed');
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
        onFormSubmit={handleFormSubmitWithRefresh}
        onFormCancel={handleFormCancel}
        onSetViewModeToList={setViewModeToList}
      />
    </div>
  );
};
