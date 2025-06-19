
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Asset, AssetInsert, AssetUpdate } from "@/hooks/useAssets";

interface AssetFormData {
  name: string;
  description?: string;
  asset_tag?: string;
  location?: string;
  category: string;
  criticality: string;
  status: string;
}

interface AssetFormProps {
  initialData?: Asset;
  onSubmit: (data: AssetInsert | AssetUpdate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" }
];

const categoryOptions = [
  { value: "equipment", label: "Equipment" },
  { value: "production_equipment", label: "Production Equipment" },
  { value: "material_handling", label: "Material Handling" },
  { value: "hvac", label: "HVAC" },
  { value: "electrical", label: "Electrical" },
  { value: "safety", label: "Safety" }
];

const criticalityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const locationOptions = [
  { value: "production_line_1", label: "Production Line 1" },
  { value: "production_line_2", label: "Production Line 2" },
  { value: "production_line_3", label: "Production Line 3" },
  { value: "warehouse", label: "Warehouse" },
  { value: "utility_room", label: "Utility Room" },
  { value: "office", label: "Office" }
];

export const AssetForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  mode 
}: AssetFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AssetFormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      asset_tag: initialData?.asset_tag || "",
      location: initialData?.location || "",
      category: initialData?.category || "equipment",
      criticality: initialData?.criticality || "medium",
      status: initialData?.status || "active"
    }
  });

  const watchedStatus = watch("status");
  const watchedCategory = watch("category");
  const watchedCriticality = watch("criticality");
  const watchedLocation = watch("location");

  const handleFormSubmit = (data: AssetFormData) => {
    const submitData = {
      ...data,
      tenant_id: "default-tenant", // This should come from your auth context
    };

    onSubmit(submitData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Asset" : "Edit Asset"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Asset name is required" })}
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset_tag">Asset Tag</Label>
                <Input
                  id="asset_tag"
                  {...register("asset_tag")}
                  placeholder="e.g., WRP-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                placeholder="Enter asset description..."
              />
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Criticality *</Label>
                <Select
                  value={watchedCriticality}
                  onValueChange={(value) => setValue("criticality", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    {criticalityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={watchedLocation}
                  onValueChange={(value) => setValue("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Asset" : "Update Asset"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssetForm;
