import React from 'react';
import { WorkOrder } from '@/features/workOrders/types';
import { WorkOrdersList } from './WorkOrdersList';
import { WorkOrderDetailView } from './WorkOrderDetailView';

interface WorkOrderSplitLayoutProps {
  workOrders: WorkOrder[];
  selectedWorkOrder: string | null;
  onSelectWorkOrder: (id: string) => void;
  onEditWorkOrder: () => void;
  selectedWorkOrderData?: WorkOrder;
}

export const WorkOrderSplitLayout: React.FC<WorkOrderSplitLayoutProps> = ({
  workOrders,
  selectedWorkOrder,
  onSelectWorkOrder,
  onEditWorkOrder,
  selectedWorkOrderData
}) => {
  return (
    <div className="flex h-full">
      {/* Left Panel - Work Orders List */}
      <div className="w-80 border-r border-border bg-background">
        <WorkOrdersList
          workOrders={workOrders}
          selectedWorkOrder={selectedWorkOrder}
          onSelectWorkOrder={onSelectWorkOrder}
        />
      </div>
      
      {/* Right Panel - Work Order Details */}
      <div className="flex-1 bg-background">
        {selectedWorkOrderData ? (
          <WorkOrderDetailView
            workOrder={selectedWorkOrderData}
            onEditWorkOrder={onEditWorkOrder}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a work order</h3>
              <p>Choose a work order from the list to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};