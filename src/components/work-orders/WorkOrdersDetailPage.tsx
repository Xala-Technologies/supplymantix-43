
import React from 'react';
import { ArrowLeft, ClipboardList, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { PageContent } from '@/components/Layout/PageContent';
import { EnhancedWorkOrderDetail } from './EnhancedWorkOrderDetail';
import { WorkOrder } from '@/types/workOrder';

interface WorkOrdersDetailPageProps {
  selectedWorkOrderData: WorkOrder;
  onBackToList: () => void;
  onEditWorkOrder: () => void;
}

export const WorkOrdersDetailPage = ({
  selectedWorkOrderData,
  onBackToList,
  onEditWorkOrder
}: WorkOrdersDetailPageProps) => {
  const backButton = (
    <Button
      variant="ghost"
      onClick={onBackToList}
      className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl px-3 py-2 font-medium transition-all duration-200 -ml-3"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Work Orders
    </Button>
  );

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Work Order Details"
          description={selectedWorkOrderData.title}
          icon={ClipboardList}
          backButton={backButton}
          actions={
            <Button
              onClick={onEditWorkOrder}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-2.5 font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit Work Order
            </Button>
          }
        />

        <PageContent>
          <EnhancedWorkOrderDetail
            workOrder={selectedWorkOrderData}
            onEdit={onEditWorkOrder}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
