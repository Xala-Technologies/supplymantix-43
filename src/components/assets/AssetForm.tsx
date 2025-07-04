
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { Asset, AssetInsert, AssetUpdate } from "@/hooks/useAssets";
import { useVendors } from "@/hooks/useVendors";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { useTeams } from "@/hooks/useTeams";
import { useParts } from "@/hooks/useParts";
import { AssetImageUpload } from "./AssetImageUpload";
import { AssetDocumentUpload } from "./AssetDocumentUpload";
import { BarcodeGenerator } from "./BarcodeGenerator";

interface AssetFormData {
  name: string;
  description?: string;
  asset_tag?: string;
  location?: string;
  category: string;
  criticality: string;
  status: "active" | "maintenance" | "out_of_service" | "retired";
  // New fields
  picture_url?: string;
  purchase_date?: string;
  purchase_price?: number;
  annual_depreciation_value?: number;
  warranty_end_date?: string;
  vin_number?: string;
  replacement_date?: string;
  serial_number?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  teams_in_charge?: string[];
  qr_code?: string;
  barcode?: string;
  asset_type?: string;
  vendor?: string;
  parts?: any[];
  parent_asset_id?: string;
}

interface AssetFormProps {
  initialData?: Asset;
  onSubmit: (data: Omit<AssetInsert, 'tenant_id'> | Omit<AssetUpdate, 'tenant_id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of Service" },
  { value: "retired", label: "Retired" }
] as const;

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
  const [documents, setDocuments] = useState<any[]>(initialData?.parts || []);
  
  // Fetch supporting data
  const { data: vendors = [] } = useVendors();
  const { data: assetTypes = [] } = useAssetTypes();
  const { data: teams = [] } = useTeams();
  const { data: parts = [] } = useParts();

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
      status: initialData?.status || "active",
      // New fields
      picture_url: initialData?.picture_url || "",
      purchase_date: initialData?.purchase_date || "",
      purchase_price: initialData?.purchase_price || undefined,
      annual_depreciation_value: initialData?.annual_depreciation_value || undefined,
      warranty_end_date: initialData?.warranty_end_date || "",
      vin_number: initialData?.vin_number || "",
      replacement_date: initialData?.replacement_date || "",
      serial_number: initialData?.serial_number || "",
      model: initialData?.model || "",
      manufacturer: initialData?.manufacturer || "",
      year: initialData?.year || undefined,
      teams_in_charge: initialData?.teams_in_charge || [],
      qr_code: initialData?.qr_code || "",
      barcode: initialData?.barcode || "",
      asset_type: initialData?.asset_type || "",
      vendor: initialData?.vendor || "",
      parts: initialData?.parts || [],
      parent_asset_id: initialData?.parent_asset_id || ""
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: AssetFormData) => {
    // Clean up the data to convert empty strings to null for UUID fields
    const cleanedData = {
      ...data,
      parts: documents,
      // Convert empty strings to null for UUID fields
      parent_asset_id: data.parent_asset_id === "" ? null : data.parent_asset_id,
      // Convert empty strings to null for optional string fields
      picture_url: data.picture_url === "" ? null : data.picture_url,
      asset_tag: data.asset_tag === "" ? null : data.asset_tag,
      location: data.location === "" ? null : data.location,
      description: data.description === "" ? null : data.description,
      purchase_date: data.purchase_date === "" ? null : data.purchase_date,
      warranty_end_date: data.warranty_end_date === "" ? null : data.warranty_end_date,
      vin_number: data.vin_number === "" ? null : data.vin_number,
      replacement_date: data.replacement_date === "" ? null : data.replacement_date,
      serial_number: data.serial_number === "" ? null : data.serial_number,
      model: data.model === "" ? null : data.model,
      manufacturer: data.manufacturer === "" ? null : data.manufacturer,
      qr_code: data.qr_code === "" ? null : data.qr_code,
      barcode: data.barcode === "" ? null : data.barcode,
      asset_type: data.asset_type === "" ? null : data.asset_type,
      vendor: data.vendor === "" ? null : data.vendor,
    };
    
    onSubmit(cleanedData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <AssetImageUpload
              currentImageUrl={watchedValues.picture_url}
              onImageUploaded={(url) => setValue("picture_url", url)}
              onImageRemoved={() => setValue("picture_url", "")}
            />
          </CardContent>
        </Card>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  {...register("manufacturer")}
                  placeholder="e.g., Caterpillar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  {...register("model")}
                  placeholder="e.g., 320D"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  {...register("year", { valueAsNumber: true })}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  {...register("serial_number")}
                  placeholder="e.g., SN123456789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin_number">VIN Number</Label>
                <Input
                  id="vin_number"
                  {...register("vin_number")}
                  placeholder="e.g., 1HGBH41JXMN109186"
                  maxLength={17}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  {...register("purchase_price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  {...register("purchase_date")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_depreciation_value">Annual Depreciation</Label>
                <Input
                  id="annual_depreciation_value"
                  type="number"
                  step="0.01"
                  {...register("annual_depreciation_value", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warranty_end_date">Warranty End Date</Label>
                <Input
                  id="warranty_end_date"
                  type="date"
                  {...register("warranty_end_date")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replacement_date">Replacement Date</Label>
                <Input
                  id="replacement_date"
                  type="date"
                  {...register("replacement_date")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asset Type</Label>
                <Select
                  value={watchedValues.asset_type}
                  onValueChange={(value) => setValue("asset_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={watchedValues.category}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Criticality *</Label>
                <Select
                  value={watchedValues.criticality}
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

              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={watchedValues.location}
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
                  value={watchedValues.status}
                  onValueChange={(value: "active" | "maintenance" | "out_of_service" | "retired") => setValue("status", value)}
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

            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select
                value={watchedValues.vendor}
                onValueChange={(value) => setValue("vendor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teams & Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Teams & Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Teams in Charge</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={watchedValues.teams_in_charge?.includes(team.name) || false}
                      onCheckedChange={(checked) => {
                        const currentTeams = watchedValues.teams_in_charge || [];
                        if (checked) {
                          setValue("teams_in_charge", [...currentTeams, team.name]);
                        } else {
                          setValue("teams_in_charge", currentTeams.filter(t => t !== team.name));
                        }
                      }}
                    />
                    <Label htmlFor={`team-${team.id}`} className="text-sm">
                      {team.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <BarcodeGenerator
              qrCode={watchedValues.qr_code}
              barcode={watchedValues.barcode}
              onQrCodeChange={(value) => setValue("qr_code", value)}
              onBarcodeChange={(value) => setValue("barcode", value)}
            />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDocumentUpload
              documents={documents}
              onDocumentsChanged={setDocuments}
            />
          </CardContent>
        </Card>

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
    </div>
  );
};

export default AssetForm;
