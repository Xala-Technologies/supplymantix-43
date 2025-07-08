
import React from 'react';
import { ArrowLeft, ClipboardList, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout/Layout';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { PageContent } from '@/components/Layout/PageContent';
import { WorkOrderDetailCard } from "./WorkOrderDetailCard";
import { WorkOrderChat } from "./WorkOrderChat";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { TimeTrackingCard } from "./TimeTrackingCard";
import { WorkOrderStatusFlow } from "./WorkOrderStatusFlow";
import { EnhancedChecklistSimple } from "./EnhancedChecklistSimple";
import { PartsUsageCard } from "./PartsUsageCard";
import { WorkOrder } from '@/types/workOrder';
import { useQuery } from '@tanstack/react-query';
import { workOrdersEnhancedApi } from '@/lib/database/work-orders-enhanced';

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
  // Fetch enhanced work order data with all relations
  const { data: enhancedWorkOrder, isLoading } = useQuery({
    queryKey: ['work-order-with-relations', selectedWorkOrderData.id],
    queryFn: () => workOrdersEnhancedApi.getWorkOrderWithRelations(selectedWorkOrderData.id),
    enabled: !!selectedWorkOrderData.id,
  });

  // Use enhanced data if available, fall back to provided data
  // Cast to any to avoid TypeScript issues with mixed data types
  const workOrderData = (enhancedWorkOrder || selectedWorkOrderData) as any;

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
          description={workOrderData.title}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading work order details...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Content - Work Order Details */}
                <div className="xl:col-span-3">
                  <WorkOrderDetailCard workOrder={workOrderData} />
                </div>

                {/* Sidebar - Status & Actions */}
                <div className="xl:col-span-1 space-y-6">
                  <WorkOrderStatusFlow workOrder={workOrderData} />
                  <TimeTrackingCard workOrderId={workOrderData.id} />
                  <PartsUsageCard workOrderId={workOrderData.id} />
                </div>
              </div>

              {/* Secondary Content - Comments, History, etc */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="space-y-6">
                  <EnhancedChecklistSimple workOrderId={workOrderData.id} />
                  <StatusHistoryTimeline workOrderId={workOrderData.id} />
                </div>
                <div>
                  <WorkOrderChat workOrderId={workOrderData.id} />
                </div>
              </div>
            </>
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
};
