
import { useState } from "react";
import { WorkOrdersContent } from "./WorkOrdersContent";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { useWorkOrdersIntegration } from "@/features/workOrders/hooks/useWorkOrdersIntegration";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";

export const WorkOrdersPage = () => {
  const { data: workOrders = [], isLoading } = useWorkOrdersIntegration();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  
  // Add filters state
  const [filters, setFilters] = useState<WorkOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    location: 'all',
    dateRange: 'all'
  });

  // Filter work orders based on current filters
  const filteredWorkOrders = workOrders.filter(wo => {
    if (filters.search && !wo.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && wo.status !== filters.status) {
      return false;
    }
    if (filters.priority !== 'all' && wo.priority !== filters.priority) {
      return false;
    }
    if (filters.category !== 'all' && wo.category !== filters.category) {
      return false;
    }
    return true;
  });

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

  const handleCreateWorkOrder = () => {
    setEditingWorkOrder(null);
    setViewMode('form');
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
      <WorkOrdersTopHeader 
        workOrdersCount={filteredWorkOrders.length}
        totalCount={workOrders.length}
        filters={filters}
        onFiltersChange={setFilters}
        onCreateWorkOrder={handleCreateWorkOrder}
      />
      <div className="flex-1 overflow-hidden">
        <WorkOrdersContent
          filteredWorkOrders={filteredWorkOrders}
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
