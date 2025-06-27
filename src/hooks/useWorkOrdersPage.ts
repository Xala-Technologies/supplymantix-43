import { useState, useMemo, useEffect } from "react";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";
import { toast } from "sonner";
import { workOrdersApi } from "@/lib/database/work-orders";
import { supabase } from "@/integrations/supabase/client";
import { useDataLoader } from "./useDataLoader";

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

  // Use robust data loader for work orders
  const workOrdersLoader = useDataLoader(
    async () => {
      console.log('Loading work orders with robust loader...');
      const orders = await workOrdersApi.getWorkOrders();
      return Array.isArray(orders) ? orders : [];
    },
    [],
    {
      cacheKey: 'work-orders',
      retryAttempts: 3,
      showErrorToast: true
    }
  );

  // Use the loaded work orders or fallback to provided ones
  const activeWorkOrders = workOrdersLoader.data || workOrders || [];

  // Transform work orders to ensure consistent format
  const transformedWorkOrders = useMemo(() => {
    return activeWorkOrders.map(wo => ({
      ...wo,
      assignedTo: wo.assignedTo || (wo.assigned_to ? [wo.assigned_to] : []),
      dueDate: wo.dueDate || wo.due_date,
      createdAt: wo.createdAt || wo.created_at,
      timeSpent: wo.timeSpent || wo.time_spent || 0,
      totalCost: wo.totalCost || wo.total_cost || 0,
      partsUsed: wo.partsUsed || wo.parts_used || []
    }));
  }, [activeWorkOrders]);

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
        (filters.assignedTo === 'me' && wo.assignedTo?.includes('current-user'));

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

      // If assignedTo is provided, we need to find the user ID from the email
      let assignedUserId = null;
      if (data.assignedTo && data.assignedTo.trim() !== '') {
        // First check if it's already a UUID (user ID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(data.assignedTo)) {
          // It's already a UUID, use it directly
          assignedUserId = data.assignedTo;
        } else {
          // It's an email, find the user ID
          const { data: assignedUser, error: userLookupError } = await supabase
            .from('users')
            .select('id')
            .eq('email', data.assignedTo)
            .eq('tenant_id', userData.tenant_id)
            .single();

          if (userLookupError || !assignedUser) {
            console.error('Error finding assigned user:', userLookupError);
            toast.error("Could not find assigned user");
            return;
          }

          assignedUserId = assignedUser.id;
        }
      }

      // Validate and clean the form data
      const cleanData = {
        title: data.title?.trim(),
        description: data.description?.trim() || '',
        status: data.status || 'open',
        priority: data.priority || 'medium',
        category: data.category || 'maintenance',
        assigned_to: assignedUserId,
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
      
      // Refresh data after successful submission
      workOrdersLoader.refetch();
      
      // Reset form state and go back to list
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
    console.log('Setting view mode to list');
    setViewMode('list');
    setSelectedWorkOrder(null);
    setEditingWorkOrder(null);
  };

  const refreshData = () => {
    workOrdersLoader.refetch();
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
    setViewModeToList,
    refreshData,
    isLoading: workOrdersLoader.isLoading,
    isRetrying: workOrdersLoader.isRetrying,
    error: workOrdersLoader.error
  };
};
