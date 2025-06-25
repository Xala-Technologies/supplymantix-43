
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { WorkOrdersTopHeader } from "./WorkOrdersTopHeader";
import { WorkOrdersDesktopLayout } from "./WorkOrdersDesktopLayout";
import { WorkOrdersMobileLayout } from "./WorkOrdersMobileLayout";
import { useWorkOrders, useCreateWorkOrder, useUpdateWorkOrder } from "@/hooks/useWorkOrders";
import { WorkOrder } from "@/types/workOrder";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout } from "@/components/Layout/StandardPageLayout";

export const WorkOrdersPage = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: workOrders = [], refetch } = useWorkOrders();
  const createWorkOrderMutation = useCreateWorkOrder();
  const updateWorkOrderMutation = useUpdateWorkOrder();

  const selectedWorkOrderData = workOrders.find(wo => wo.id === selectedWorkOrder);

  const handleSelectWorkOrder = (id: string) => {
    setSelectedWorkOrder(id);
    setViewMode('detail');
    setEditingWorkOrder(null);
    setIsCreating(false);
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

  // Filter work orders (you can add filters here later)
  const filteredWorkOrders = workOrders;

  return (
    <StandardPageLayout>
      <WorkOrdersTopHeader onCreateWorkOrder={handleCreateWorkOrder} />
      
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
        />
      </div>
    </StandardPageLayout>
  );
};
