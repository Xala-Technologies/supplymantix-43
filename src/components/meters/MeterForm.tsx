
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeter } from "@/hooks/useMetersEnhanced";
import { useAssets } from "@/hooks/useAssets";
import { X } from "lucide-react";

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

  const createMeter = useCreateMeter();
  const { data: assets } = useAssets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const meterData = {
        name: formData.name,
        type: formData.type,
        unit: formData.unit,
        description: formData.description || null,
        location: formData.location || null,
        asset_id: formData.asset_id || null,
        reading_frequency: formData.reading_frequency,
        target_min: formData.target_min ? Number(formData.target_min) : null,
        target_max: formData.target_max ? Number(formData.target_max) : null,
      } as any; // Type assertion to bypass the tenant_id requirement since it's handled by the API
      
      await createMeter.mutateAsync(meterData);
      onClose();
    } catch (error) {
      console.error("Error creating meter:", error);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Create New Meter</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Meter Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Compressor Runtime"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., hours, °C, PSI"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Meter Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Reading</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reading_frequency">Reading Frequency</Label>
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
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset">Associated Asset</Label>
            <Select value={formData.asset_id} onValueChange={(value) => setFormData({ ...formData, asset_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Asset</SelectItem>
                {assets?.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} {asset.location && `(${asset.location})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Production Floor A"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_min">Target Min Value</Label>
              <Input
                id="target_min"
                type="number"
                step="0.01"
                value={formData.target_min}
                onChange={(e) => setFormData({ ...formData, target_min: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_max">Target Max Value</Label>
              <Input
                id="target_max"
                type="number"
                step="0.01"
                value={formData.target_max}
                onChange={(e) => setFormData({ ...formData, target_max: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about this meter..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMeter.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createMeter.isPending ? "Creating..." : "Create Meter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
