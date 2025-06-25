
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateWorkOrder, useUpdateWorkOrder } from "@/hooks/useWorkOrders";
import { useLocations } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { WorkOrder } from "@/types/workOrder";

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
  
  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  
  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const { data: locations } = useLocations();
  
  const isEditMode = !!workOrder;
  
  // Helper function to safely extract assignee
  const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
    if (!assignedTo) return "";
    if (Array.isArray(assignedTo)) return assignedTo[0] || "";
    if (typeof assignedTo === "string") return assignedTo;
    return "";
  };

  // Helper function to safely extract location
  const getLocationName = (location: WorkOrder['location']): string => {
    if (!location) return "";
    if (typeof location === "string") return location;
    if (typeof location === "object" && location.name) return location.name;
    return "";
  };
  
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
        // Pre-populate form for editing
        const tagsString = workOrder.tags && Array.isArray(workOrder.tags) 
          ? workOrder.tags.join(', ') 
          : '';

        form.reset({
          title: workOrder.title || "",
          description: workOrder.description || "",
          priority: workOrder.priority || "medium",
          assignedTo: getAssignee(workOrder.assignedTo),
          asset: typeof workOrder.asset === 'object' ? workOrder.asset?.name || "" : workOrder.asset || "",
          location: getLocationName(workOrder.location),
          category: workOrder.category || "maintenance",
          tags: tagsString,
          dueDate: workOrder.due_date ? new Date(workOrder.due_date) : undefined,
        });
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
  }, [workOrder, open, form]);

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      setIsSubmitting(true);
      
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

      const selectedLocation = locations?.find(loc => loc.name === data.location);
      
      // Convert tags string to array
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      const workOrderData = {
        title: data.title,
        description: data.description || "",
        due_date: data.dueDate?.toISOString(),
        assigned_to: data.assignedTo || null,
        asset_id: data.asset || null,
        location_id: selectedLocation?.id || null,
        tenant_id: userData.tenant_id,
        status: "open" as const,
        priority: data.priority,
        category: data.category,
        tags: tagsArray,
        requester_id: user.id,
      };

      if (isEditMode && workOrder) {
        await updateWorkOrder.mutateAsync({
          id: workOrder.id,
          ...workOrderData,
        });
        toast.success("Work order updated successfully!");
      } else {
        await createWorkOrder.mutateAsync(workOrderData);
        toast.success("Work order created successfully!");
      }
      
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
      {!children && !controlledOpen && (
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? 'Edit Work Order' : 'Create New Work Order'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter work order title"
              {...form.register("title")}
              className="w-full"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work to be performed..."
              className="min-h-[100px] resize-none"
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value: "low" | "medium" | "high" | "urgent") => 
                  form.setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("dueDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dueDate") ? (
                      format(form.watch("dueDate")!, "PPP")
                    ) : (
                      "Pick a date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("dueDate")}
                    onSelect={(date) => form.setValue("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assigned To */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Assigned To</Label>
              <Select
                value={form.watch("assignedTo")}
                onValueChange={(value) => form.setValue("assignedTo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zach Brown">Zach Brown</SelectItem>
                  <SelectItem value="Maintenance Team 1">Maintenance Team 1</SelectItem>
                  <SelectItem value="Maintenance Team 2">Maintenance Team 2</SelectItem>
                  <SelectItem value="Safety Team">Safety Team</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                  <SelectItem value="repair">⚙️ Repair</SelectItem>
                  <SelectItem value="inspection">🔍 Inspection</SelectItem>
                  <SelectItem value="installation">🔨 Installation</SelectItem>
                  <SelectItem value="safety">🔥 Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Asset</Label>
              <Select
                value={form.watch("asset")}
                onValueChange={(value) => form.setValue("asset", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wrapper - Orion Model A">Wrapper - Orion Model A</SelectItem>
                  <SelectItem value="Conveyor - 3200 Series Modular">Conveyor - 3200 Series Modular</SelectItem>
                  <SelectItem value="35-005 - Air Compressor - VSS Single Screw">35-005 - Air Compressor - VSS Single Screw</SelectItem>
                  <SelectItem value="ABC Fire Extinguisher (5 lb)">ABC Fire Extinguisher (5 lb)</SelectItem>
                  <SelectItem value="Facility">Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <Select
                value={form.watch("location")}
                onValueChange={(value) => form.setValue("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              {...form.register("tags")}
            />
            <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Work Order" : "Create Work Order")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
