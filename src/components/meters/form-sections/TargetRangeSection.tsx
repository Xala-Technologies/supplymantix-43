
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TargetRangeSectionProps {
  formData: {
    target_min: string;
    target_max: string;
  };
  errors: Record<string, string>;
  onFormDataChange: (updates: Partial<any>) => void;
}

export const TargetRangeSection = ({ formData, errors, onFormDataChange }: TargetRangeSectionProps) => {
  return (
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
              onChange={(e) => onFormDataChange({ target_min: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Target</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.target_max}
              onChange={(e) => onFormDataChange({ target_max: e.target.value })}
              placeholder="100"
              className={errors.target_max ? "border-red-300" : ""}
            />
            {errors.target_max && <p className="text-sm text-red-600">{errors.target_max}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
