
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
              onClick={onFormCancel}
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
            onSubmit={onFormSubmit}
            onCancel={onFormCancel}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
