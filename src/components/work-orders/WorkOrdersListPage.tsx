
import React from 'react';
import { ClipboardList } from 'lucide-react';
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
import { WorkOrdersPageHeader } from './WorkOrdersPageHeader';
import { WorkOrder, WorkOrderFilters } from '@/types/workOrder';

interface WorkOrdersListPageProps {
  workOrders: WorkOrder[];
  filteredWorkOrders: WorkOrder[];
  filters: WorkOrderFilters;
  onFiltersChange: (filters: WorkOrderFilters) => void;
  selectedWorkOrder: string | null;
  onSelectWorkOrder: (id: string) => void;
  viewMode: 'card' | 'list' | 'calendar';
  onViewModeChange: (mode: 'card' | 'list' | 'calendar') => void;
  onNewWorkOrder: () => void;
}

export const WorkOrdersListPage = ({
  workOrders,
  filteredWorkOrders,
  filters,
  onFiltersChange,
  selectedWorkOrder,
  onSelectWorkOrder,
  viewMode,
  onViewModeChange,
  onNewWorkOrder
}: WorkOrdersListPageProps) => {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Work Orders"
          description={`${filteredWorkOrders.length} ${filteredWorkOrders.length === 1 ? 'work order' : 'work orders'}`}
          icon={ClipboardList}
          actions={
            <WorkOrdersPageHeader
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              onNewWorkOrder={onNewWorkOrder}
            />
          }
        />
        
        <FilterBar>
          <WorkOrdersFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
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
                onClick: onNewWorkOrder
              }}
            />
          ) : (
            <SectionCard padding="none" className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
              {viewMode === 'card' ? (
                <WorkOrdersCardView
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={onSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              ) : (
                <WorkOrdersListView
                  workOrders={filteredWorkOrders}
                  onSelectWorkOrder={onSelectWorkOrder}
                  selectedWorkOrderId={selectedWorkOrder}
                />
              )}
            </SectionCard>
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
