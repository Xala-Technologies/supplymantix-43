
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateWorkOrder, useUpdateWorkOrder } from "@/hooks/useWorkOrders";
import { useLocations } from "@/hooks/useLocations";
import { useAssets } from "@/hooks/useAssets";
import { useUsers } from "@/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderFormFields } from "./form-sections/WorkOrderFormFields";
import { getAssignee, getLocationId, getAssetId } from "./form-sections/WorkOrderFormHelpers";
import { processWorkOrderSubmission } from "./form-sections/WorkOrderFormLogic";

const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  asset: z.string().optional(),
  location: z.string().optional(),
  category: z.string().default("maintenance"),
  tags: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface NewWorkOrderDialogProps {
  workOrder?: WorkOrder;
  onSuccess?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewWorkOrderDialog = ({ 
  workOrder, 
  onSuccess,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: NewWorkOrderDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  
  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const { data: locations } = useLocations();
  const { data: assets } = useAssets();
  const { data: users } = useUsers();
  
  const isEditMode = !!workOrder;
  
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      asset: "",
      location: "",
      category: "maintenance",
      tags: "",
    },
  });

  // Reset form when workOrder changes or dialog opens
  useEffect(() => {
    if (open) {
      if (workOrder) {
        // Pre-populate form for editing - use IDs for asset and location
        const tagsString = workOrder.tags && Array.isArray(workOrder.tags) 
          ? workOrder.tags.join(', ') 
          : '';

        const formData = {
          title: workOrder.title || "",
          description: workOrder.description || "",
          priority: workOrder.priority || "medium",
          assignedTo: getAssignee(workOrder.assignedTo),
          asset: getAssetId(workOrder.asset, workOrder.asset_id, workOrder) || "", // Pass full workOrder object
          location: getLocationId(workOrder.location, workOrder.location_id, workOrder) || "", // Pass full workOrder object
          category: workOrder.category || "maintenance",
          tags: tagsString,
          dueDate: workOrder.due_date ? new Date(workOrder.due_date) : undefined,
        };

        console.log("Setting form data for editing:", formData);
        console.log("Work order data:", workOrder);
        form.reset(formData);
      } else {
        // Reset form for new work order
        form.reset({
          title: "",
          description: "",
          priority: "medium",
          assignedTo: "",
          asset: "",
          location: "",
          category: "maintenance",
          tags: "",
          dueDate: undefined,
        });
      }
    }
  }, [workOrder, open, form, assets, locations]);

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure all required fields are properly typed
      const formData = {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        dueDate: data.dueDate,
        assignedTo: data.assignedTo || "",
        asset: data.asset || "", // This is already an ID now
        location: data.location || "", // This is already an ID now
        category: data.category,
        tags: data.tags || "",
      };

      console.log("Submitting form data:", formData);

      const workOrderData = await processWorkOrderSubmission(formData, users, assets, locations);

      if (isEditMode && workOrder) {
        // For updates, we need to pass { id, updates } structure
        await updateWorkOrder.mutateAsync({
          id: workOrder.id,
          updates: workOrderData,
        });
        toast.success("Work order updated successfully!");
      } else {
        await createWorkOrder.mutateAsync(workOrderData);
        toast.success("Work order created successfully!");
      }

      // Invalidate and refetch work orders data to show new work order immediately
      await queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["work-orders-integration"] });
      
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error managing work order:", error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} work order. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {isEditMode ? 'Edit Work Order' : 'Create New Work Order'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <WorkOrderFormFields 
            form={form}
            users={users}
            assets={assets}
            locations={locations}
          />

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Work Order" : "Create Work Order")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
