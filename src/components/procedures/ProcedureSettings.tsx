
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Lock, Users, MapPin, Package, Tag } from "lucide-react";

interface ProcedureSettingsProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
  };
  onUpdate: (data: any) => void;
  categories: string[];
}

export const ProcedureSettings: React.FC<ProcedureSettingsProps> = ({
  formData,
  onUpdate,
  categories
}) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      onUpdate(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    onUpdate(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Tag Your Procedure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tag your procedure
          </CardTitle>
          <p className="text-sm text-gray-600">
            Add tags to this procedure so you can easily find it on your Library
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Categories</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => onUpdate(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Start typing..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assets</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Start typing..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compressor">Compressor</SelectItem>
                <SelectItem value="pump">Pump</SelectItem>
                <SelectItem value="generator">Generator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Locations</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Start typing..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facility-a">Facility A</SelectItem>
                <SelectItem value="facility-b">Facility B</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Custom Tags</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md mt-1 bg-gray-50">
              {formData.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100 hover:text-red-700" 
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm">No custom tags</span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams in Charge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Teams in charge
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage who is responsible for this procedure
          </p>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Start typing..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance Team</SelectItem>
              <SelectItem value="operations">Operations Team</SelectItem>
              <SelectItem value="safety">Safety Team</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Procedure Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Procedure Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.is_global ? "public" : "private"}
            onValueChange={(value) => onUpdate(prev => ({ 
              ...prev, 
              is_global: value === "public" 
            }))}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="private" id="private" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="private" className="font-medium">Keep Private</Label>
                </div>
                <p className="text-sm text-gray-600">
                  This Procedure will only be visible to your teammates at MaintainX.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="public" id="public" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <Label htmlFor="public" className="font-medium">Make Public</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Publish this Procedure to the Global Procedure Library for everyone in the MaintainX Community to see.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};
