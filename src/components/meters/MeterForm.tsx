
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { useAssets } from "@/hooks/useAssets";
import { X, Settings, Zap, Factory } from "lucide-react";

interface MeterFormProps {
  onClose: () => void;
}

export const MeterForm = ({ onClose }: MeterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "manual",
    unit: "",
    description: "",
    location: "",
    asset_id: "",
    reading_frequency: "none",
    target_min: "",
    target_max: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMeter = useCreateMeter();
  const { data: assets } = useAssets();

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
        target_max: formData.target_max ? Number(formData.target_max) : null,
      } as any;
      
      await createMeter.mutateAsync(meterData);
      onClose();
    } catch (error) {
      console.error("Error creating meter:", error);
    }
  };

  const commonUnits = [
    "°C", "°F", "PSI", "bar", "kPa", "Hz", "RPM", "V", "A", "kW", "kWh", 
    "L/min", "m³/h", "hours", "minutes", "%", "ppm"
  ];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">Create New Meter</DialogTitle>
            <p className="text-gray-600 text-sm mt-1">Set up a new meter to track performance</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Meter Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Compressor Runtime Monitor"
                    className={errors.name ? "border-red-300" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., hours, °C, PSI"
                    className={errors.unit ? "border-red-300" : ""}
                  />
                  {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
                  <div className="flex flex-wrap gap-1">
                    {commonUnits.map((unit) => (
                      <Badge 
                        key={unit}
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50 text-xs"
                        onClick={() => setFormData({ ...formData, unit })}
                      >
                        {unit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meter Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Manual Reading
                        </div>
                      </SelectItem>
                      <SelectItem value="automated">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Automated
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reading Frequency</Label>
                  <Select value={formData.reading_frequency} onValueChange={(value) => setFormData({ ...formData, reading_frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">As Needed</SelectItem>
                      <SelectItem value="hour">Hourly</SelectItem>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Asset */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location & Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Associated Asset</Label>
                  <Select value={formData.asset_id} onValueChange={(value) => setFormData({ ...formData, asset_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Asset</SelectItem>
                      {assets?.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4" />
                            {asset.name} {asset.location && `(${asset.location})`}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Production Floor A"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Target Range (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Target</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.target_min}
                    onChange={(e) => setFormData({ ...formData, target_min: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Target</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.target_max}
                    onChange={(e) => setFormData({ ...formData, target_max: e.target.value })}
                    placeholder="100"
                    className={errors.target_max ? "border-red-300" : ""}
                  />
                  {errors.target_max && <p className="text-sm text-red-600">{errors.target_max}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this meter..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMeter.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMeter.isPending ? "Creating..." : "Create Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
