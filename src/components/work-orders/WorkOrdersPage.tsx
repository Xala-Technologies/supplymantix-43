import { useState, useEffect } from "react";
import { toast } from "sonner";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { WorkOrdersDesktopLayout } from "./WorkOrdersDesktopLayout";
import { WorkOrdersMobileLayout } from "./WorkOrdersMobileLayout";
import { WorkOrderCalendarView } from "./WorkOrderCalendarView";
import { useWorkOrders, useCreateWorkOrder, useUpdateWorkOrder } from "@/hooks/useWorkOrders";
import { WorkOrder, WorkOrderFilters } from "@/features/workOrders/types";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout } from "@/components/Layout/StandardPageLayout";
import { useQueryClient } from "@tanstack/react-query";

export const WorkOrdersPage = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<'list' | 'calendar'>('list');

  // Add filters state
  const [filters, setFilters] = useState<WorkOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all'
  });

  const { data: rawWorkOrders = [], refetch, isLoading, error } = useWorkOrders();
  const createWorkOrderMutation = useCreateWorkOrder();
  const updateWorkOrderMutation = useUpdateWorkOrder();
  const queryClient = useQueryClient();

  console.log('WorkOrdersPage - Raw data:', rawWorkOrders);
  console.log('WorkOrdersPage - Loading:', isLoading);
  console.log('WorkOrdersPage - Error:', error);

  // Transform raw work orders to proper WorkOrder type - with safety checks
  const workOrders: WorkOrder[] = Array.isArray(rawWorkOrders) 
    ? rawWorkOrders.filter(wo => wo && wo.id).map(wo => {
        try {
          // If it's already normalized, return as is
          if (wo.assignedTo && Array.isArray(wo.assignedTo)) {
            return wo as WorkOrder;
          }
          // Otherwise, it needs normalization (shouldn't happen with current setup)
          console.warn('Work order may need normalization:', wo);
          return wo as WorkOrder;
        } catch (error) {
          console.error('Error processing work order:', error, wo);
          return null;
        }
      }).filter(Boolean) as WorkOrder[]
    : [];

  console.log('WorkOrdersPage - Processed work orders:', workOrders);

  // Apply filters to work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    if (!wo) return false;
    
    if (filters.search && !wo.title?.toLowerCase().includes(filters.search.toLowerCase())) {
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

  console.log('WorkOrdersPage - Filtered work orders:', filteredWorkOrders);

  // Auto-select first work order when filtered list changes (only for list view)
  useEffect(() => {
    if (calendarViewMode === 'list' && filteredWorkOrders.length > 0) {
      const firstWorkOrderId = filteredWorkOrders[0]?.id;
      if (firstWorkOrderId && (!selectedWorkOrder || !filteredWorkOrders.find(wo => wo.id === selectedWorkOrder))) {
        setSelectedWorkOrder(firstWorkOrderId);
        if (viewMode === 'list') {
          setViewMode('detail');
        }
      }
    } else if (filteredWorkOrders.length === 0) {
      setSelectedWorkOrder(null);
      if (viewMode === 'detail') {
        setViewMode('list');
      }
    }
  }, [filteredWorkOrders, selectedWorkOrder, calendarViewMode, viewMode]);

  const selectedWorkOrderData = workOrders.find(wo => wo?.id === selectedWorkOrder);

  const handleSelectWorkOrder = (id: string) => {
    const workOrder = workOrders.find(wo => wo.id === id);
    if (workOrder) {
      setSelectedWorkOrder(id);
      setViewMode('detail');
      setEditingWorkOrder(null);
      setIsCreating(false);
    }
  };

  const handleCreateWorkOrder = () => {
    setEditingWorkOrder(null);
    setIsCreating(true);
    setViewMode('form');
    setSelectedWorkOrder(null);
  };

  const handleEditWorkOrder = () => {
    if (selectedWorkOrderData) {
      setEditingWorkOrder(selectedWorkOrderData);
      setIsCreating(false);
      setViewMode('form');
    }
  };

  const handleSetViewModeToList = () => {
    setViewMode('list');
    setSelectedWorkOrder(null);
    setEditingWorkOrder(null);
    setIsCreating(false);
  };

  const handleViewModeChange = (mode: 'list' | 'calendar') => {
    setCalendarViewMode(mode);
    if (mode === 'calendar') {
      setViewMode('list'); // Reset to list view when switching to calendar
      setSelectedWorkOrder(null);
      setEditingWorkOrder(null);
      setIsCreating(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    console.log("WorkOrdersPage - handling form submit:", data);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to manage work orders");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        toast.error("Error getting user information");
        return;
      }

      // Prepare the work order data
      const workOrderData = {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        category: data.category,
        assigned_to: data.assignedTo || null,
        asset_id: data.assetId || null,
        location_id: data.location || null,
        due_date: data.dueDate || null,
        tags: data.tags || [],
        tenant_id: userData.tenant_id,
        requester_id: user.id,
      };

      console.log("Prepared work order data:", workOrderData);

      if (editingWorkOrder) {
        // Update existing work order
        console.log("Updating work order with ID:", editingWorkOrder.id);
        
        await updateWorkOrderMutation.mutateAsync({
          id: editingWorkOrder.id,
          updates: {
            ...workOrderData,
            updated_at: new Date().toISOString()
          }
        });
        
        toast.success("Work order updated successfully");
      } else {
        // Create new work order
        await createWorkOrderMutation.mutateAsync({
          ...workOrderData,
          status: "open"
        });
        
        toast.success("Work order created successfully");
      }

      // Reset form state and refresh data
      setViewMode('list');
      setEditingWorkOrder(null);
      setIsCreating(false);
      setSelectedWorkOrder(null);
      
      // Invalidate and refetch work orders to ensure calendar view updates
      await queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      await refetch();
      
    } catch (error) {
      console.error("Error submitting work order:", error);
      toast.error(editingWorkOrder ? "Failed to update work order" : "Failed to create work order");
    }
  };

  const handleFormCancel = () => {
    setViewMode(selectedWorkOrder ? 'detail' : 'list');
    setEditingWorkOrder(null);
    setIsCreating(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <StandardPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading work orders...</p>
          </div>
        </div>
      </StandardPageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <StandardPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load work orders</h3>
            <p className="text-gray-600 mb-4">There was an error loading your work orders.</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout>
      <WorkOrdersTopHeader 
        workOrdersCount={filteredWorkOrders.length}
        totalCount={workOrders.length}
        filters={filters}
        onFiltersChange={setFilters}
        onCreateWorkOrder={handleCreateWorkOrder}
        viewMode={calendarViewMode}
        onViewModeChange={handleViewModeChange}
      />
      
      {calendarViewMode === 'calendar' ? (
        <div className="h-full">
          <WorkOrderCalendarView
            workOrders={filteredWorkOrders}
            onSelectWorkOrder={handleSelectWorkOrder}
            selectedWorkOrderId={selectedWorkOrder}
          />
        </div>
      ) : (
        <>
          {/* Desktop Layout */}
          <div className="hidden lg:block h-full">
            <WorkOrdersDesktopLayout
              filteredWorkOrders={filteredWorkOrders}
              selectedWorkOrder={selectedWorkOrder}
              viewMode={viewMode}
              selectedWorkOrderData={selectedWorkOrderData}
              editingWorkOrder={editingWorkOrder}
              onSelectWorkOrder={handleSelectWorkOrder}
              onEditWorkOrder={handleEditWorkOrder}
              onFormSubmit={handleFormSubmit}
              onFormCancel={handleFormCancel}
            />
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden h-full">
            <WorkOrdersMobileLayout
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
        </>
      )}
    </StandardPageLayout>
  );
};
