
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NewWorkOrderDialog } from './NewWorkOrderDialog';
import { WorkOrdersLoadingPage } from './WorkOrdersLoadingPage';
import { WorkOrdersCalendarPage } from './WorkOrdersCalendarPage';
import { WorkOrdersDetailPage } from './WorkOrdersDetailPage';
import { WorkOrdersFormPage } from './WorkOrdersFormPage';
import { WorkOrdersListPage } from './WorkOrdersListPage';
import { WorkOrderSplitLayout } from './WorkOrderSplitLayout';
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

  // Default list view - use split layout for card/list view modes
  if (viewMode === 'card' || viewMode === 'list') {
    return (
      <>
        <div className="h-screen flex flex-col">
          {/* Header with view mode toggle and new work order button */}
          <div className="flex-shrink-0 p-4 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Work Orders</h1>
                <p className="text-muted-foreground">Manage and track your work orders</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-border p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      viewMode === 'card'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className="px-3 py-1.5 text-sm font-medium rounded transition-colors text-muted-foreground hover:text-foreground"
                  >
                    Calendar
                  </button>
                </div>
                <button
                  onClick={handleNewWorkOrder}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  New Work Order
                </button>
              </div>
            </div>
          </div>
          
          {/* Split Layout */}
          <div className="flex-1 overflow-hidden">
            <WorkOrderSplitLayout
              workOrders={filteredWorkOrders}
              selectedWorkOrder={selectedWorkOrder}
              onSelectWorkOrder={handleSelectWorkOrder}
              onEditWorkOrder={handleEditWorkOrder}
              selectedWorkOrderData={selectedWorkOrderData}
            />
          </div>
        </div>
        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
          returnData={returnData}
        />
      </>
    );
  }

  // Fallback to original list page for any other cases
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
