import React, { useState } from 'react';
import { WorkOrdersList } from './WorkOrdersList';
import { QuickCreateWorkOrderModal, type QuickWorkOrderInput } from './QuickCreateWorkOrderModal';
import { WorkOrderDetailCard } from '@/components/work-orders/WorkOrderDetailCard';
import { WorkOrder } from '@/types/workOrder';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface WorkOrdersDashboardProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: (data: QuickWorkOrderInput) => void;
  isCreateLoading?: boolean;
}

export const WorkOrdersDashboard = ({ 
  workOrders, 
  onCreateWorkOrder,
  isCreateLoading = false 
}: WorkOrdersDashboardProps) => {
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const selectedWorkOrder = workOrders.find(wo => wo.id === selectedWorkOrderId);

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrderId(id);
    setIsMobileDetailView(true);
  };

  const handleBackToList = () => {
    setIsMobileDetailView(false);
    setSelectedWorkOrderId(null);
  };

  const handleCreateSubmit = async (data: QuickWorkOrderInput) => {
    try {
      await onCreateWorkOrder(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create work order:', error);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col">
        {!isMobileDetailView ? (
          <div className="flex-1 p-4">
            <WorkOrdersList
              workOrders={workOrders}
              onSelectWorkOrder={handleSelectWorkOrder}
              onCreateWorkOrder={() => setIsCreateModalOpen(true)}
              selectedWorkOrderId={selectedWorkOrderId}
            />
          </div>
        ) : (
          <>
            {/* Mobile Detail Header */}
            <div className="p-4 bg-white border-b flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackToList}
                className="p-1 h-auto"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">
                  {selectedWorkOrder?.title || 'Work Order Details'}
                </h2>
                <p className="text-sm text-gray-500">
                  #{selectedWorkOrderId?.slice(-4)}
                </p>
              </div>
            </div>
            
            {/* Mobile Detail Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedWorkOrder ? (
                <WorkOrderDetailCard workOrder={selectedWorkOrder} />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Work order not found
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Work Orders List */}
        <div className="w-1/2 xl:w-2/5 p-6 border-r border-gray-200">
          <WorkOrdersList
            workOrders={workOrders}
            onSelectWorkOrder={handleSelectWorkOrder}
            onCreateWorkOrder={() => setIsCreateModalOpen(true)}
            selectedWorkOrderId={selectedWorkOrderId}
          />
        </div>
        
        {/* Work Order Detail */}
        <div className="flex-1 p-6 bg-white">
          {selectedWorkOrder ? (
            <div className="h-full overflow-y-auto">
              <WorkOrderDetailCard workOrder={selectedWorkOrder} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Work Order
                </h3>
                <p className="text-sm text-gray-500">
                  Choose a work order from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Create Modal */}
      <QuickCreateWorkOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreateLoading}
      />
    </div>
  );
};
