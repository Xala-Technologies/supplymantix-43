
import React from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { PageContent } from '@/components/Layout/PageContent';
import { EnhancedWorkOrderForm } from './EnhancedWorkOrderForm';
import { WorkOrder } from '@/types/workOrder';

interface WorkOrdersFormPageProps {
  editingWorkOrder: WorkOrder | null;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
}

export const WorkOrdersFormPage = ({
  editingWorkOrder,
  onFormSubmit,
  onFormCancel
}: WorkOrdersFormPageProps) => {
  const backButton = (
    <Button
      variant="ghost"
      onClick={onFormCancel}
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
          title={editingWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
          description={editingWorkOrder ? editingWorkOrder.title : 'Create a new work order'}
          icon={ClipboardList}
          backButton={backButton}
        />

        <PageContent>
          <EnhancedWorkOrderForm
            workOrder={editingWorkOrder}
            onSubmit={onFormSubmit}
            onCancel={onFormCancel}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
