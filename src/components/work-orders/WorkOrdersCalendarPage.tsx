
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { FilterBar } from '@/components/Layout/FilterBar';
import { PageContent } from '@/components/Layout/PageContent';
import { SectionCard } from '@/components/Layout/SectionCard';
import { WorkOrdersFilters } from './WorkOrdersFilters';
import { WorkOrderCalendarView } from './WorkOrderCalendarView';
import { WorkOrdersPageHeader } from './WorkOrdersPageHeader';
import { WorkOrder, WorkOrderFilters } from '@/types/workOrder';

interface WorkOrdersCalendarPageProps {
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

export const WorkOrdersCalendarPage = ({
  workOrders,
  filteredWorkOrders,
  filters,
  onFiltersChange,
  selectedWorkOrder,
  onSelectWorkOrder,
  viewMode,
  onViewModeChange,
  onNewWorkOrder
}: WorkOrdersCalendarPageProps) => {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Work Orders Calendar"
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
          <SectionCard padding="none">
            <WorkOrderCalendarView
              workOrders={filteredWorkOrders}
              onSelectWorkOrder={onSelectWorkOrder}
              selectedWorkOrderId={selectedWorkOrder}
            />
          </SectionCard>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
