
import React, { useState } from 'react';
import { NewWorkOrderDialog } from './NewWorkOrderDialog';
import { WorkOrdersLoadingPage } from './WorkOrdersLoadingPage';
import { WorkOrdersCalendarPage } from './WorkOrdersCalendarPage';
import { WorkOrdersDetailPage } from './WorkOrdersDetailPage';
import { WorkOrdersFormPage } from './WorkOrdersFormPage';
import { WorkOrdersListPage } from './WorkOrdersListPage';
import { useWorkOrdersPage } from '@/hooks/useWorkOrdersPage';
import { useWorkOrdersIntegration } from '@/hooks/useWorkOrdersIntegration';

export const WorkOrdersPageRefactored = () => {
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'calendar'>('card');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const { data: workOrders = [], isLoading } = useWorkOrdersIntegration();
  const {
    filters,
    setFilters,
    filteredWorkOrders,
    selectedWorkOrder,
    viewMode: contentViewMode,
    selectedWorkOrderData,
    editingWorkOrder,
    handleSelectWorkOrder,
    handleEditWorkOrder,
    handleFormSubmit,
    handleFormCancel,
    setViewModeToList
  } = useWorkOrdersPage(workOrders);

  const handleNewWorkOrder = () => {
    setShowNewDialog(true);
  };

  const handleDialogSuccess = () => {
    setShowNewDialog(false);
  };

  const handleBackToList = () => {
    setViewModeToList();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <WorkOrdersLoadingPage
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewWorkOrder={handleNewWorkOrder}
        />
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
        />
      </>
    );
  }

  // Calendar view
  if (viewMode === 'calendar') {
    return (
      <>
        <WorkOrdersCalendarPage
          workOrders={workOrders}
          filteredWorkOrders={filteredWorkOrders}
          filters={filters}
          onFiltersChange={setFilters}
          selectedWorkOrder={selectedWorkOrder}
          onSelectWorkOrder={handleSelectWorkOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewWorkOrder={handleNewWorkOrder}
        />
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
        />
      </>
    );
  }

  // Detail view
  if (contentViewMode === 'detail' && selectedWorkOrderData) {
    return (
      <>
        <WorkOrdersDetailPage
          selectedWorkOrderData={selectedWorkOrderData}
          onBackToList={handleBackToList}
          onEditWorkOrder={handleEditWorkOrder}
        />
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
        />
      </>
    );
  }

  // Form view
  if (contentViewMode === 'form') {
    return (
      <>
        <WorkOrdersFormPage
          editingWorkOrder={editingWorkOrder}
          onFormSubmit={handleFormSubmit}
          onFormCancel={handleFormCancel}
        />
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
        />
      </>
    );
  }

  // Default list view
  return (
    <>
      <WorkOrdersListPage
        workOrders={workOrders}
        filteredWorkOrders={filteredWorkOrders}
        filters={filters}
        onFiltersChange={setFilters}
        selectedWorkOrder={selectedWorkOrder}
        onSelectWorkOrder={handleSelectWorkOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewWorkOrder={handleNewWorkOrder}
      />
      <NewWorkOrderDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};
