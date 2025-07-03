
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NewWorkOrderDialog } from './NewWorkOrderDialog';
import { WorkOrdersLoadingPage } from './WorkOrdersLoadingPage';
import { WorkOrdersCalendarPage } from './WorkOrdersCalendarPage';
import { WorkOrdersDetailPage } from './WorkOrdersDetailPage';
import { WorkOrdersFormPage } from './WorkOrdersFormPage';
import { WorkOrdersListPage } from './WorkOrdersListPage';
import { useWorkOrdersPage } from '@/hooks/useWorkOrdersPage';
import { useWorkOrdersIntegration } from '@/hooks/useWorkOrdersIntegration';

export const WorkOrdersPageRefactored = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'calendar'>('card');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [returnData, setReturnData] = useState<any>(null);
  
  const { data: workOrders = [], isLoading } = useWorkOrdersIntegration();

  // Handle return from other pages
  useEffect(() => {
    if (location.state?.openNewWorkOrder) {
      setShowNewDialog(true);
      if (location.state?.returnData) {
        setReturnData(location.state.returnData);
      }
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
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
    setReturnData(null);
  };

  const handleBackToList = () => {
    console.log('Back to list clicked, resetting to list view');
    setViewModeToList();
  };

  const handleFormCancelWithBack = () => {
    console.log('Form cancel with back clicked, resetting to list view');
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
          returnData={returnData}
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
          returnData={returnData}
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
          returnData={returnData}
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
          onFormCancel={handleFormCancelWithBack}
        />
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
          returnData={returnData}
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
        returnData={returnData}
      />
    </>
  );
};
