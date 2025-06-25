
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkOrder, WorkOrderStatus, WorkOrderCategory } from "@/types/workOrder";
import { toast } from "sonner";

export const useWorkOrdersIntegration = () => {
  return useQuery({
    queryKey: ["work-orders-integration"],
    queryFn: async () => {
      console.log("Fetching work orders...");
      
      const { data: workOrdersData, error } = await supabase
        .from("work_orders")
        .select(`
          *,
          assets(name, status),
          locations(name)
        `);

      if (error) {
        console.error("Work orders fetch error:", error);
        throw error;
      }

      console.log("Raw work orders from API:", workOrdersData);

      if (!workOrdersData) {
        console.log("No work orders data received");
        return [];
      }

      // Transform the data to match our WorkOrder interface
      const transformedWorkOrders: WorkOrder[] = workOrdersData.map((wo) => {
        const transformed = {
          id: wo.id,
          tenant_id: wo.tenant_id,
          title: wo.title,
          description: wo.description || "",
          status: wo.status,
          priority: wo.priority || "medium",
          assignedTo: wo.assigned_to ? [wo.assigned_to] : [],
          asset: wo.assets?.name || wo.asset_id || "",
          location: wo.locations?.name || wo.location_id || "",
          dueDate: wo.due_date || "",
          due_date: wo.due_date || "",
          category: (wo.category || "maintenance") as WorkOrderCategory,
          timeSpent: wo.time_spent || 0,
          totalCost: wo.total_cost || 0,
          tags: wo.tags || [],
          createdAt: wo.created_at,
          created_at: wo.created_at,
          updatedAt: wo.updated_at,
          updated_at: wo.updated_at,
        };
        
        console.log("Transformed work order:", transformed);
        return transformed;
      });

      console.log("Final transformed work orders:", transformedWorkOrders);
      return transformedWorkOrders;
    },
  });
};

export const useWorkOrderStatusUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: WorkOrderStatus; notes?: string }) => {
      const { data, error } = await supabase
        .from("work_orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders-integration"] });
      toast.success("Work order status updated successfully");
    },
    onError: (error) => {
      console.error("Status update error:", error);
      toast.error("Failed to update work order status");
    }
  });
};
