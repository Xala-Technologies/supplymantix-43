
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Zap } from "lucide-react";
import { UnitBadges } from "./UnitBadges";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    type: string;
    unit: string;
    reading_frequency: string;
  };
  errors: Record<string, string>;
  onFormDataChange: (updates: Partial<any>) => void;
}

export const BasicInfoSection = ({ formData, errors, onFormDataChange }: BasicInfoSectionProps) => {
  return (
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
              onChange={(e) => onFormDataChange({ name: e.target.value })}
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
              onChange={(e) => onFormDataChange({ unit: e.target.value })}
              placeholder="e.g., hours, °C, PSI"
              className={errors.unit ? "border-red-300" : ""}
            />
            {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
            <UnitBadges onUnitSelect={(unit) => onFormDataChange({ unit })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Meter Type</Label>
            <Select value={formData.type} onValueChange={(value) => onFormDataChange({ type: value })}>
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
            <Select value={formData.reading_frequency} onValueChange={(value) => onFormDataChange({ reading_frequency: value })}>
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
  );
};
