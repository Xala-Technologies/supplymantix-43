
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { useAssets } from "@/hooks/useAssets";
import { X, BarChart3, Zap, Settings, Factory, MapPin, Target, Info } from "lucide-react";

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
        asset_id: formData.asset_id === "no-asset" ? null : formData.asset_id || null,
        reading_frequency: formData.reading_frequency,
        target_min: formData.target_min ? Number(formData.target_min) : null,
        target_max: formData.target_max ? Number(formData.target_max) : null,
        tenant_id: undefined, // This will be handled by the API
      } as any;
      
      await createMeter.mutateAsync(meterData);
      onClose();
    } catch (error) {
      console.error("Error creating meter:", error);
    }
  };

  const commonUnits = [
    "°C", "°F", "PSI", "bar", "kPa", "Hz", "RPM", "V", "A", "kW", "kWh", 
    "L/min", "m³/h", "hours", "minutes", "seconds", "%", "ppm", "pH"
  ];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Create New Meter</DialogTitle>
              <p className="text-gray-600 mt-1">Set up a new meter to track asset performance</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Meter Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Compressor Runtime Monitor"
                    className={errors.name ? "border-red-300 focus:border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">
                    Unit of Measurement <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g., hours, °C, PSI"
                      className={errors.unit ? "border-red-300 focus:border-red-500" : ""}
                    />
                    {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonUnits.map((unit) => (
                      <Badge 
                        key={unit}
                        variant="outline" 
                        className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 text-xs"
                        onClick={() => setFormData({ ...formData, unit })}
                      >
                        {unit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Configuration</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">Meter Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="h-12">
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
                  <Label htmlFor="reading_frequency" className="text-sm font-medium">Reading Frequency</Label>
                  <Select value={formData.reading_frequency} onValueChange={(value) => setFormData({ ...formData, reading_frequency: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">As Needed</SelectItem>
                      <SelectItem value="hour">Every Hour</SelectItem>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Asset */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Location & Asset</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="asset" className="text-sm font-medium">Associated Asset</Label>
                  <Select value={formData.asset_id} onValueChange={(value) => setFormData({ ...formData, asset_id: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select an asset (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-asset">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          No Asset
                        </div>
                      </SelectItem>
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
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Production Floor A, Building 2"
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Range */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Target Range (Optional)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="target_min" className="text-sm font-medium">Minimum Target Value</Label>
                  <Input
                    id="target_min"
                    type="number"
                    step="0.01"
                    value={formData.target_min}
                    onChange={(e) => setFormData({ ...formData, target_min: e.target.value })}
                    placeholder="0"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_max" className="text-sm font-medium">Maximum Target Value</Label>
                  <Input
                    id="target_max"
                    type="number"
                    step="0.01"
                    value={formData.target_max}
                    onChange={(e) => setFormData({ ...formData, target_max: e.target.value })}
                    placeholder="100"
                    className={errors.target_max ? "border-red-300 focus:border-red-500 h-12" : "h-12"}
                  />
                  {errors.target_max && <p className="text-sm text-red-600">{errors.target_max}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this meter, its purpose, and monitoring requirements..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMeter.isPending}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 min-w-[120px]"
              size="lg"
            >
              {createMeter.isPending ? "Creating..." : "Create Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
