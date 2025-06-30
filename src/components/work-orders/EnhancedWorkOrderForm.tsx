
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { AssignmentSection } from "./form-sections/AssignmentSection";
import { LocationSection } from "./form-sections/LocationSection";
import { TagsSection } from "./form-sections/TagsSection";
import { TemplateSection } from "./form-sections/TemplateSection";

const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().optional(),
  assetId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().default("maintenance"),
  tags: z.array(z.string()).default([]),
  location: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface EnhancedWorkOrderFormProps {
  workOrder?: WorkOrder;
  onSubmit: (data: WorkOrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Asset {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

export const EnhancedWorkOrderForm = ({
  workOrder,
  onSubmit,
  onCancel,
  isLoading = false
}: EnhancedWorkOrderFormProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Helper function to safely extract asset ID
  const getAssetId = (asset: WorkOrder['asset']): string => {
    if (!asset) return "";
    if (typeof asset === "string") return asset;
    if (typeof asset === "object" && 'id' in asset && typeof asset.id === 'string') return asset.id;
    return "";
  };

  // Helper function to safely extract location ID
  const getLocationId = (location: WorkOrder['location']): string => {
    if (!location) return "";
    if (typeof location === "string") return location;
    if (typeof location === "object" && 'id' in location && typeof location.id === 'string') return location.id;
    return "";
  };

  // Helper function to safely extract assignee
  const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
    if (!assignedTo) return "";
    if (Array.isArray(assignedTo)) return assignedTo[0] || "";
    if (typeof assignedTo === "string") return assignedTo;
    return "";
  };

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      category: "maintenance",
      tags: [],
      dueDate: "",
      assetId: "",
      location: "",
    },
  });

  const { watch, setValue, reset } = form;
  const currentTags = watch("tags");

  // Fetch assets and locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, locationsResponse] = await Promise.all([
          supabase.from('assets').select('id, name'),
          supabase.from('locations').select('id, name')
        ]);

        if (assetsResponse.data) {
          setAssets(assetsResponse.data);
        }

        if (locationsResponse.data) {
          setLocations(locationsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Reset form values when workOrder changes
  useEffect(() => {
    if (workOrder) {
      console.log('Setting form values for work order:', workOrder);
      const formData = {
        title: workOrder.title || "",
        description: workOrder.description || "",
        priority: workOrder.priority || "medium",
        assignedTo: getAssignee(workOrder.assignedTo),
        category: workOrder.category || "maintenance",
        tags: workOrder.tags || [],
        dueDate: workOrder.due_date ? new Date(workOrder.due_date).toISOString().split('T')[0] : "",
        assetId: getAssetId(workOrder.asset),
        location: getLocationId(workOrder.location),
      };
      console.log('Form data being set:', formData);
      reset(formData);
    } else {
      // Reset to empty values for new work order
      reset({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        category: "maintenance",
        tags: [],
        dueDate: "",
        assetId: "",
        location: "",
      });
    }
  }, [workOrder, reset]);

  const applyTemplate = (templateId: string) => {
    console.log("Applying template:", templateId);
    // Implementation would fetch template and update form values
  };

  const handleSubmit = async (data: WorkOrderFormData) => {
    console.log("Form data before submission:", data);
    
    try {
      // Transform the form data to match the expected format
      const transformedData = {
        ...data,
        // Ensure we're passing the correct field names
        assignedTo: data.assignedTo || undefined,
        assetId: data.assetId || undefined,
        location: data.location || undefined,
        dueDate: data.dueDate || undefined,
      };
      
      console.log("Transformed data:", transformedData);
      
      // Call the parent's onSubmit with transformed data
      onSubmit(transformedData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit work order');
    }
  };

  // Create a wrapper function for tags setValue
  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-sm">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {workOrder ? 'Edit Work Order' : 'Create Work Order'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Template Selection */}
            {!workOrder && (
              <TemplateSection
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                applyTemplate={applyTemplate}
              />
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BasicInfoSection
                form={form}
                watch={watch}
                setValue={setValue}
              />

              <AssignmentSection
                form={form}
                watch={watch}
                setValue={setValue}
                assets={assets}
              />
            </div>

            {/* Location */}
            <LocationSection
              watch={watch}
              setValue={setValue}
              locations={locations}
            />

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the work to be performed..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* Tags */}
            <TagsSection
              currentTags={currentTags}
              setValue={handleTagsChange}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : workOrder ? "Update Work Order" : "Create Work Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
