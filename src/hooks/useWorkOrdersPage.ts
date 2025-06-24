import { useState, useMemo, useEffect } from "react";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";
import { toast } from "sonner";
import { workOrdersApi } from "@/lib/database/work-orders";
import { supabase } from "@/integrations/supabase/client";

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

  // Auto-select first work order when filtered list changes
  useEffect(() => {
    if (filteredWorkOrders.length > 0) {
      const firstWorkOrderId = filteredWorkOrders[0].id;
      if (!selectedWorkOrder || !filteredWorkOrders.find(wo => wo.id === selectedWorkOrder)) {
        setSelectedWorkOrder(firstWorkOrderId);
        setViewMode('detail');
      }
    } else {
      setSelectedWorkOrder(null);
      setViewMode('list');
    }
  }, [filteredWorkOrders, selectedWorkOrder]);

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
      console.log('Submitting work order:', data);
      
      // Get current user's tenant_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError) {
        console.error('Error getting user tenant:', userError);
        toast.error("Failed to get user information");
        return;
      }

      // Validate and clean the form data
      const cleanData = {
        title: data.title?.trim(),
        description: data.description?.trim() || '',
        status: data.status || 'open',
        priority: data.priority || 'medium',
        category: data.category || 'maintenance',
        assigned_to: data.assignedTo && data.assignedTo.trim() !== '' ? data.assignedTo : null,
        asset_id: data.assetId && data.assetId.trim() !== '' ? data.assetId : null,
        due_date: data.dueDate && data.dueDate.trim() !== '' ? data.dueDate : null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        location_id: data.location && data.location.trim() !== '' ? data.location : null,
        tenant_id: userData.tenant_id,
        requester_id: (await supabase.auth.getUser()).data.user?.id
      };

      // Validate required fields
      if (!cleanData.title) {
        toast.error("Title is required");
        return;
      }

      console.log('Cleaned work order data:', cleanData);

      if (editingWorkOrder) {
        // Update existing work order
        await workOrdersApi.updateWorkOrder(editingWorkOrder.id, cleanData);
        toast.success("Work order updated successfully");
      } else {
        // Create new work order
        await workOrdersApi.createWorkOrder(cleanData);
        toast.success("Work order created successfully");
      }
      
      // Reset form state
      setViewMode('list');
      setEditingWorkOrder(null);
      setSelectedWorkOrder(null);
      
    } catch (error) {
      console.error('Error submitting work order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save work order';
      toast.error(errorMessage);
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
