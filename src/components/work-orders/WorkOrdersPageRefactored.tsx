
import React, { useState } from 'react';
import { Plus, LayoutGrid, List, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { FilterBar } from '@/components/Layout/FilterBar';
import { PageContent } from '@/components/Layout/PageContent';
import { SectionCard } from '@/components/Layout/SectionCard';
import { EmptyState } from '@/components/Layout/EmptyState';
import { WorkOrdersFilters } from './WorkOrdersFilters';
import { WorkOrdersCardView } from './WorkOrdersCardView';
import { WorkOrdersListView } from './WorkOrdersListView';
import { WorkOrderCalendarView } from './WorkOrderCalendarView';
import { WorkOrdersContent } from './WorkOrdersContent';
import { EnhancedWorkOrderDetail } from './EnhancedWorkOrderDetail';
import { EnhancedWorkOrderForm } from './EnhancedWorkOrderForm';
import { NewWorkOrderDialog } from './NewWorkOrderDialog';
import { useWorkOrdersPage } from '@/hooks/useWorkOrdersPage';
import { useWorkOrdersIntegration } from '@/hooks/useWorkOrdersIntegration';
import { ClipboardList } from 'lucide-react';

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
    handleCreateWorkOrder,
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

  const viewToggleActions = (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
        <Button
          variant={viewMode === 'card' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('card')}
          className={`h-9 px-4 rounded-lg transition-all duration-200 ${
            viewMode === 'card' 
              ? 'bg-white shadow-sm border-0 text-gray-900' 
              : 'hover:bg-white/60 border-0 text-gray-600'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className={`h-9 px-4 rounded-lg transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-white shadow-sm border-0 text-gray-900' 
              : 'hover:bg-white/60 border-0 text-gray-600'
          }`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'calendar' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('calendar')}
          className={`h-9 px-4 rounded-lg transition-all duration-200 ${
            viewMode === 'calendar' 
              ? 'bg-white shadow-sm border-0 text-gray-900' 
              : 'hover:bg-white/60 border-0 text-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>
      <Button 
        onClick={handleNewWorkOrder} 
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2 px-6 py-2.5 rounded-xl font-medium"
      >
        <Plus className="w-4 h-4" />
        New Work Order
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title="Work Orders"
            description="Manage and track maintenance work orders"
            icon={ClipboardList}
            actions={viewToggleActions}
          />
          <PageContent>
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-base text-gray-600 font-medium">Loading work orders...</p>
              </div>
            </div>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  // If calendar view is selected, show calendar view
  if (viewMode === 'calendar') {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title="Work Orders Calendar"
            description={`${filteredWorkOrders.length} ${filteredWorkOrders.length === 1 ? 'work order' : 'work orders'}`}
            icon={ClipboardList}
            actions={viewToggleActions}
          />
          
          <FilterBar>
            <WorkOrdersFilters
              filters={filters}
              onFiltersChange={setFilters}
              workOrders={workOrders}
            />
          </FilterBar>

          <PageContent>
            <SectionCard padding="none">
              <WorkOrderCalendarView
                workOrders={filteredWorkOrders}
                onSelectWorkOrder={handleSelectWorkOrder}
                selectedWorkOrderId={selectedWorkOrder}
              />
            </SectionCard>
          </PageContent>

          <NewWorkOrderDialog
            open={showNewDialog}
            onOpenChange={setShowNewDialog}
            onSuccess={handleDialogSuccess}
          />
        </PageContainer>
      </Layout>
    );
  }

  // If detail view is selected, show the work order detail with procedures
  if (contentViewMode === 'detail' && selectedWorkOrderData) {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title="Work Order Details"
            description={selectedWorkOrderData.title}
            icon={ClipboardList}
            actions={
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm rounded-xl px-5 py-2.5 font-medium transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </Button>
                <Button
                  onClick={handleEditWorkOrder}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-2.5 font-medium"
                >
                  Edit Work Order
                </Button>
              </div>
            }
          />

          <PageContent>
            <EnhancedWorkOrderDetail
              workOrder={selectedWorkOrderData}
              onEdit={handleEditWorkOrder}
            />
          </PageContent>

          <NewWorkOrderDialog
            open={showNewDialog}
            onOpenChange={setShowNewDialog}
            onSuccess={handleDialogSuccess}
          />
        </PageContainer>
      </Layout>
    );
  }

  // If form view is selected, show the enhanced work order form
  if (contentViewMode === 'form') {
    return (
      <Layout>
        <PageContainer>
          <PageHeader
            title={editingWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
            description={editingWorkOrder ? editingWorkOrder.title : 'Create a new work order'}
            icon={ClipboardList}
            actions={
              <Button
                variant="outline"
                onClick={handleFormCancel}
                className="gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm rounded-xl px-5 py-2.5 font-medium transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Button>
            }
          />

          <PageContent>
            <EnhancedWorkOrderForm
              workOrder={editingWorkOrder}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </PageContent>

          <NewWorkOrderDialog
            open={showNewDialog}
            onOpenChange={setShowNewDialog}
            onSuccess={handleDialogSuccess}
          />
        </PageContainer>
      </Layout>
    );
  }

  // Card/List view (default) - Show work orders in card or list format
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Work Orders"
          description={`${filteredWorkOrders.length} ${filteredWorkOrders.length === 1 ? 'work order' : 'work orders'}`}
          icon={ClipboardList}
          actions={viewToggleActions}
        />
        
        <FilterBar>
          <WorkOrdersFilters
            filters={filters}
            onFiltersChange={setFilters}
            workOrders={workOrders}
          />
        </FilterBar>

        <PageContent>
          {filteredWorkOrders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No work orders found"
              description="Get started by creating your first work order or adjust your search filters."
              action={{
                label: "Create Work Order",
                onClick: handleNewWorkOrder
              }}
            />
          ) : (
            <SectionCard padding="none" className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
              {viewMode === 'card' ? (
                <WorkOrdersCardView
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              ) : (
                <WorkOrdersListView
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={handleSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              )}
            </SectionCard>
          )}
        </PageContent>

        <NewWorkOrderDialog
          open={showNewDialog}
          onOpenChange={setShowNewDialog}
          onSuccess={handleDialogSuccess}
        />
      </PageContainer>
    </Layout>
  );
};
