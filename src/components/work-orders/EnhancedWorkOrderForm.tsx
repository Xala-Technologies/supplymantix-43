
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar, User, Tag, Clock, FileTemplate, Plus, X } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";

const workOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().optional(),
  assetId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().default("maintenance"),
  tags: z.array(z.string()).default([]),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface EnhancedWorkOrderFormProps {
  workOrder?: WorkOrder;
  onSubmit: (data: WorkOrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EnhancedWorkOrderForm = ({
  workOrder,
  onSubmit,
  onCancel,
  isLoading = false
}: EnhancedWorkOrderFormProps) => {
  const [newTag, setNewTag] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: workOrder?.title || "",
      description: workOrder?.description || "",
      priority: workOrder?.priority || "medium",
      assignedTo: workOrder?.assignedTo?.[0] || "",
      category: workOrder?.category || "maintenance",
      tags: workOrder?.tags || [],
      dueDate: workOrder?.due_date ? new Date(workOrder.due_date).toISOString().split('T')[0] : "",
    },
  });

  const { watch, setValue, getValues } = form;
  const currentTags = watch("tags");

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const applyTemplate = (templateId: string) => {
    // This would load template data and populate the form
    console.log("Applying template:", templateId);
    // Implementation would fetch template and update form values
  };

  const handleSubmit = (data: WorkOrderFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileTemplate className="w-5 h-5" />
            {workOrder ? 'Edit Work Order' : 'Create Work Order'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Template Selection */}
            {!workOrder && (
              <div className="space-y-2">
                <Label>Start from Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={(value) => {
                  setSelectedTemplate(value);
                  applyTemplate(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Routine Maintenance</SelectItem>
                    <SelectItem value="repair">Equipment Repair</SelectItem>
                    <SelectItem value="inspection">Safety Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Enter work order title"
                    className="mt-1"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={watch("priority")}
                    onValueChange={(value) => setValue("priority", value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignedTo">Assignee</Label>
                  <Select
                    value={watch("assignedTo")}
                    onValueChange={(value) => setValue("assignedTo", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select assignee..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe</SelectItem>
                      <SelectItem value="user2">Jane Smith</SelectItem>
                      <SelectItem value="team1">Maintenance Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <div className="relative mt-1">
                    <Input
                      id="dueDate"
                      type="date"
                      {...form.register("dueDate")}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="assetId">Asset</Label>
                  <Select
                    value={watch("assetId")}
                    onValueChange={(value) => setValue("assetId", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset1">Conveyor Belt A</SelectItem>
                      <SelectItem value="asset2">Packaging Machine B</SelectItem>
                      <SelectItem value="asset3">HVAC System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

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
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

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
