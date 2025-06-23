import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { useAssets } from "@/hooks/useAssets";
import { X } from "lucide-react";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { LocationAssetSection } from "./form-sections/LocationAssetSection";
import { TargetRangeSection } from "./form-sections/TargetRangeSection";
interface MeterFormProps {
  onClose: () => void;
}
export const MeterForm = ({
  onClose
}: MeterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "manual",
    unit: "",
    description: "",
    location: "",
    asset_id: "",
    reading_frequency: "none",
    target_min: "",
    target_max: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMeter = useCreateMeter();
  const {
    data: assets
  } = useAssets();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Meter name is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (formData.target_min && formData.target_max) {
      const min = Number(formData.target_min);
      const max = Number(formData.target_max);
      if (min >= max) {
        newErrors.target_max = "Maximum value must be greater than minimum";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const meterData = {
        name: formData.name.trim(),
        type: formData.type,
        unit: formData.unit.trim(),
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        asset_id: formData.asset_id === "no-asset" || !formData.asset_id ? null : formData.asset_id,
        reading_frequency: formData.reading_frequency,
        target_min: formData.target_min ? Number(formData.target_min) : null,
        target_max: formData.target_max ? Number(formData.target_max) : null
      } as any;
      await createMeter.mutateAsync(meterData);
      onClose();
    } catch (error) {
      console.error("Error creating meter:", error);
    }
  };
  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };
  return <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">Create New Meter</DialogTitle>
            <p className="text-gray-600 text-sm mt-1">Set up a new meter to track performance</p>
          </div>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection formData={formData} errors={errors} onFormDataChange={handleFormDataChange} />

          <LocationAssetSection formData={formData} assets={assets} onFormDataChange={handleFormDataChange} />

          <TargetRangeSection formData={formData} errors={errors} onFormDataChange={handleFormDataChange} />

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={e => handleFormDataChange({
            description: e.target.value
          })} placeholder="Additional details about this meter..." rows={3} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMeter.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createMeter.isPending ? "Creating..." : "Create Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};