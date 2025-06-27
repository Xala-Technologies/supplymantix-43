
import React, { useState } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
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
import { NewWorkOrderDialog } from './NewWorkOrderDialog';
import { useWorkOrdersPage } from '@/hooks/useWorkOrdersPage';
import { useWorkOrdersIntegration } from '@/hooks/useWorkOrdersIntegration';
import { ClipboardList } from 'lucide-react';

export const WorkOrdersPageRefactored = () => {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const { workOrders, isLoading, createWorkOrder } = useWorkOrdersIntegration();
  const {
    filters,
    setFilters,
    filteredWorkOrders,
    selectedWorkOrder,
    handleSelectWorkOrder,
    handleCreateWorkOrder,
    handleEditWorkOrder,
    handleFormSubmit,
    handleFormCancel
  } = useWorkOrdersPage(workOrders);

  const handleNewWorkOrder = () => {
    setShowNewDialog(true);
  };

  const handleCreateSubmit = async (data: any) => {
    try {
      await createWorkOrder(data);
      setShowNewDialog(false);
    } catch (error) {
      console.error('Failed to create work order:', error);
    }
  };

  const viewToggleActions = (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-gray-200 rounded-lg p-1">
        <Button
          variant={viewMode === 'card' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('card')}
          className="h-8 px-3"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-8 px-3"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      <Button onClick={handleNewWorkOrder} className="gap-2">
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
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Loading work orders...</p>
              </div>
            </div>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

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
            <SectionCard padding="none">
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
          onSubmit={handleCreateSubmit}
        />
      </PageContainer>
    </Layout>
  );
};
