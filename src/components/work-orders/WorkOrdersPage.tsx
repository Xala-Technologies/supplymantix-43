
import { useState } from "react";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { useWorkOrdersIntegration } from "@/features/workOrders/hooks/useWorkOrdersIntegration";
import { WorkOrder } from "@/types/workOrder";

export const WorkOrdersPage = () => {
  const { data: workOrders = [], isLoading } = useWorkOrdersIntegration();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

  const selectedWorkOrderData = workOrders.find(wo => wo.id === selectedWorkOrder);

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrder(id);
    setViewMode('list');
    setTimeout(() => setViewMode('detail'), 50);
  };

  const handleEditWorkOrder = () => {
    if (selectedWorkOrderData) {
      setEditingWorkOrder(selectedWorkOrderData);
      setViewMode('form');
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setViewMode('list');
    setEditingWorkOrder(null);
  };

  const handleFormCancel = () => {
    setViewMode(selectedWorkOrder ? 'detail' : 'list');
    setEditingWorkOrder(null);
  };

  const handleSetViewModeToList = () => {
    setViewMode('list');
    setSelectedWorkOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading work orders...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <WorkOrdersTopHeader />
      <div className="flex-1 overflow-hidden">
        <WorkOrdersContent
          filteredWorkOrders={workOrders}
          selectedWorkOrder={selectedWorkOrder}
          viewMode={viewMode}
          selectedWorkOrderData={selectedWorkOrderData}
          editingWorkOrder={editingWorkOrder}
          onSelectWorkOrder={handleSelectWorkOrder}
          onEditWorkOrder={handleEditWorkOrder}
          onFormSubmit={handleFormSubmit}
          onFormCancel={handleFormCancel}
          onSetViewModeToList={handleSetViewModeToList}
        />
      </div>
    </div>
  );
};
