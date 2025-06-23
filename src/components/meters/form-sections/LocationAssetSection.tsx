
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

interface LocationAssetSectionProps {
  formData: {
    asset_id: string;
    location: string;
  };
  assets?: Array<{ id: string; name: string; location?: string }>;
  onFormDataChange: (updates: Partial<any>) => void;
}

export const LocationAssetSection = ({ formData, assets, onFormDataChange }: LocationAssetSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Location & Asset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Associated Asset</Label>
            <Select value={formData.asset_id} onValueChange={(value) => onFormDataChange({ asset_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an asset (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-asset">No Asset</SelectItem>
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
              onChange={(e) => onFormDataChange({ location: e.target.value })}
              placeholder="e.g., Production Floor A"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
