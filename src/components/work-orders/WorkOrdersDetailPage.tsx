
import React from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
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
                onClick={onBackToList}
                className="gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm rounded-xl px-5 py-2.5 font-medium transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </Button>
              <Button
                onClick={onEditWorkOrder}
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
            onEdit={onEditWorkOrder}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
