
import { useState, useMemo } from "react";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";
import { toast } from "sonner";

export const useWorkOrdersPage = (workOrders: WorkOrder[] = []) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [filters, setFilters] = useState<WorkOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all'
  });

  // Transform work orders to ensure consistent format
  const transformedWorkOrders = useMemo(() => {
    return workOrders.map(wo => ({
      ...wo,
      assignedTo: wo.assignedTo || (wo.assigned_to ? [wo.assigned_to] : []),
      dueDate: wo.dueDate || wo.due_date,
      createdAt: wo.createdAt || wo.created_at,
      timeSpent: wo.timeSpent || wo.time_spent || 0,
      totalCost: wo.totalCost || wo.total_cost || 0,
      partsUsed: wo.partsUsed || wo.parts_used || []
    }));
  }, [workOrders]);

  // Filter work orders based on current filters
  const filteredWorkOrders = useMemo(() => {
    return transformedWorkOrders.filter(wo => {
      const matchesSearch = !filters.search || 
        wo.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        wo.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        wo.id.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || wo.status === filters.status;
      const matchesPriority = filters.priority === 'all' || wo.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || wo.category === filters.category;
      
      const matchesAssignedTo = filters.assignedTo === 'all' || 
        (filters.assignedTo === 'unassigned' && (!wo.assignedTo || wo.assignedTo.length === 0)) ||
        (filters.assignedTo === 'me' && wo.assignedTo?.includes('current-user')); // This would need proper user context

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignedTo;
    });
  }, [transformedWorkOrders, filters]);

  const selectedWorkOrderData = useMemo(() => {
    return transformedWorkOrders.find(wo => wo.id === selectedWorkOrder);
  }, [transformedWorkOrders, selectedWorkOrder]);

  const handleCreateWorkOrder = () => {
    setEditingWorkOrder(null);
    setViewMode('form');
    setSelectedWorkOrder(null);
  };

  const handleEditWorkOrder = () => {
    if (selectedWorkOrderData) {
      setEditingWorkOrder(selectedWorkOrderData);
      setViewMode('form');
    }
  };

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrder(id);
    setViewMode('detail');
    setEditingWorkOrder(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Here you would typically call an API to create/update the work order
      console.log('Submitting work order:', data);
      
      if (editingWorkOrder) {
        toast.success("Work order updated successfully");
      } else {
        toast.success("Work order created successfully");
      }
      
      // Reset form state
      setViewMode('list');
      setEditingWorkOrder(null);
      setSelectedWorkOrder(null);
    } catch (error) {
      console.error('Error submitting work order:', error);
      toast.error("Failed to save work order");
    }
  };

  const handleFormCancel = () => {
    setViewMode(selectedWorkOrder ? 'detail' : 'list');
    setEditingWorkOrder(null);
  };

  const setViewModeToList = () => {
    setViewMode('list');
    setSelectedWorkOrder(null);
    setEditingWorkOrder(null);
  };

  return {
    selectedWorkOrder,
    viewMode,
    editingWorkOrder,
    filters,
    setFilters,
    transformedWorkOrders,
    filteredWorkOrders,
    selectedWorkOrderData,
    handleCreateWorkOrder,
    handleEditWorkOrder,
    handleSelectWorkOrder,
    handleFormSubmit,
    handleFormCancel,
    setViewModeToList
  };
};
