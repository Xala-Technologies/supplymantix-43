import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetImageUpload } from "@/components/assets/AssetImageUpload";
import { AssetDocumentUpload } from "@/components/assets/AssetDocumentUpload";
import { BarcodeGenerator } from "@/components/assets/BarcodeGenerator";
import { useVendors } from "@/hooks/useVendors";
import { useTeams } from "@/hooks/useTeams";
import { useLocations } from "@/hooks/useLocations";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { useAssets } from "@/hooks/useAssets";
import type { Part as BasePart } from "@/hooks/useParts";
import { useCreateInventoryItem } from "@/hooks/useInventoryMutations";

interface AdvancedPartFormProps {
  onSuccess: () => void;
  part?: Partial<Part>; // For edit mode
}

// Extend Part type for form usage
interface Part extends BasePart {
  documents?: { name: string; url: string; size: number }[];
  picture_url?: string;
  qr_code?: string;
  barcode?: string;
  part_type?: string;
  area?: string;
  min_quantity?: number;
  assets?: string[];
  teams?: string[];
  vendor?: string;
  location?: string;
  quantity?: number;
}

interface PartFormData {
  name: string;
  description?: string;
  unit_cost?: number;
  barcode?: string;
  qr_code?: string;
  part_type?: string;
  location?: string;
  area?: string;
  quantity?: number;
  min_quantity?: number;
  assets?: string[];
  teams?: string[];
  vendor?: string;
  picture_url?: string;
  documents?: { name: string; url: string; size: number }[];
}

export const AdvancedPartForm: React.FC<AdvancedPartFormProps> = ({ onSuccess, part }) => {
  const { data: vendors = [] } = useVendors();
  const { data: teams = [] } = useTeams();
  const { data: locations = [] } = useLocations();
  const { data: assetTypes = [] } = useAssetTypes();
  const { data: assets = [] } = useAssets();
  const createPart = useCreateInventoryItem();

  const [documents, setDocuments] = useState<{ name: string; url: string; size: number }[]>(part?.documents || []);
  const [imageUrl, setImageUrl] = useState<string>(part?.picture_url || "");
  const [qrCode, setQrCode] = useState<string>(part?.qr_code || "");
  const [barcode, setBarcode] = useState<string>(part?.barcode || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PartFormData>({
    defaultValues: {
      name: part?.name || "",
      description: part?.description || "",
      unit_cost: part?.unit_cost || undefined,
      barcode: part?.barcode || "",
      qr_code: part?.qr_code || "",
      part_type: part?.part_type || "",
      location: part?.location || "",
      area: part?.area || "",
      quantity: part?.quantity || undefined,
      min_quantity: part?.min_quantity || undefined,
      assets: part?.assets || [],
      teams: part?.teams || [],
      vendor: part?.vendor || "",
      picture_url: part?.picture_url || "",
      documents: part?.documents || [],
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: PartFormData) => {
    // Clean up the data to convert empty strings to null for optional fields
    const cleanedData = {
      name: data.name,
      description: data.description || '',
      sku: '',
      location: data.location || '',
      quantity: data.quantity || 0,
      min_quantity: data.min_quantity || 0,
      unit_cost: data.unit_cost || 0,
    };
    try {
      await createPart.mutateAsync(cleanedData);
      onSuccess();
    } catch (error) {
      // TODO: Show error to user
      console.error('Failed to create part:', error);
    }
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
                <Label htmlFor="name">Part Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Part name is required" })}
                  className={errors.name && "border-red-500"}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Unit Cost</Label>
                <Input
                  id="unit_cost"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("unit_cost", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                placeholder="Enter part description..."
              />
            </div>
            <AssetImageUpload
              currentImageUrl={imageUrl}
              onImageUploaded={(url) => { setImageUrl(url); setValue("picture_url", url); }}
              onImageRemoved={() => { setImageUrl(""); setValue("picture_url", ""); }}
            />
          </CardContent>
        </Card>

        {/* Part Details */}
        <Card>
          <CardHeader>
            <CardTitle>Part Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="part_type">Part Type</Label>
                <Select
                  value={watchedValues.part_type}
                  onValueChange={(value) => setValue("part_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select part type" />
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
                <Label htmlFor="location">Location</Label>
                <Select
                  value={watchedValues.location}
                  onValueChange={(value) => setValue("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  {...register("area")}
                  placeholder="e.g., Storage Room"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Units in Stock</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={0}
                  {...register("quantity", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_quantity">Minimum in Stock</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  min={0}
                  {...register("min_quantity", { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification & Associations */}
        <Card>
          <CardHeader>
            <CardTitle>Associations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assets">Assets</Label>
                <Select
                  value={watchedValues.assets?.[0] || ""}
                  onValueChange={(value) => setValue("assets", value ? [value] : [])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teams">Teams in Charge</Label>
                <Select
                  value={watchedValues.teams?.[0] || ""}
                  onValueChange={(value) => setValue("teams", value ? [value] : [])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select
                  value={watchedValues.vendor}
                  onValueChange={(value) => setValue("vendor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barcode/QR Code */}
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BarcodeGenerator
              qrCode={qrCode}
              barcode={barcode}
              onQrCodeChange={(val) => { setQrCode(val); setValue("qr_code", val); }}
              onBarcodeChange={(val) => { setBarcode(val); setValue("barcode", val); }}
            />
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AssetDocumentUpload
              documents={documents}
              onDocumentsChanged={setDocuments}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{part ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
}; 