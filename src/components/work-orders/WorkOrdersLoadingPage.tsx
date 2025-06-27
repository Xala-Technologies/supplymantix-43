
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { PageContent } from '@/components/Layout/PageContent';
import { WorkOrdersPageHeader } from './WorkOrdersPageHeader';

interface WorkOrdersLoadingPageProps {
  viewMode: 'card' | 'list' | 'calendar';
  onViewModeChange: (mode: 'card' | 'list' | 'calendar') => void;
  onNewWorkOrder: () => void;
}

export const WorkOrdersLoadingPage = ({
  viewMode,
  onViewModeChange,
  onNewWorkOrder
}: WorkOrdersLoadingPageProps) => {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Work Orders"
          description="Manage and track maintenance work orders"
          icon={ClipboardList}
          actions={
            <WorkOrdersPageHeader
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              onNewWorkOrder={onNewWorkOrder}
            />
          }
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
};
