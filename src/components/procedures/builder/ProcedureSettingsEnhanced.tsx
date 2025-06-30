
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown } from 'lucide-react';

interface ProcedureSettingsEnhancedProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
  };
  onUpdate: (updates: Partial<ProcedureSettingsEnhancedProps['formData']>) => void;
}

const CATEGORIES = [
  'Inspection',
  'Safety',
  'Calibration',
  'Reactive Maintenance',
  'Preventive Maintenance',
  'Quality Control',
  'Training',
  'Other'
];

const ASSETS = [
  'Compressor',
  'Pump',
  'Generator',
  'HVAC System',
  'Conveyor Belt',
  'Motor',
  'Valve',
  'Sensor'
];

const LOCATIONS = [
  'Facility A',
  'Facility B',
  'Warehouse',
  'Production Floor',
  'Maintenance Shop',
  'Office Building'
];

const TEAMS = [
  'Maintenance Team',
  'Operations Team',
  'Safety Team',
  'Quality Control Team',
  'Engineering Team'
];

export const ProcedureSettingsEnhanced: React.FC<ProcedureSettingsEnhancedProps> = ({
  formData,
  onUpdate
}) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      onUpdate({
        tags: [...formData.tags, customTag.trim()]
      });
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 pb-24 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Tag your procedure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Tag your procedure</CardTitle>
              <p className="text-sm text-gray-600">
                Add tags to this procedure so you can easily find it on your Library
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Categories</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => onUpdate({ category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="Start typing..." />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assets */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Assets</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Start typing...</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSETS.map(asset => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Locations */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Locations</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Start typing...</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Tags */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Custom Tags</Label>
                <div className="mt-2 space-y-3">
                  {/* Display existing tags */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-gray-50">
                    {formData.tags.length === 0 ? (
                      <span className="text-gray-500 text-sm">No custom tags</span>
                    ) : (
                      formData.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))
                    )}
                  </div>
                  
                  {/* Add new tag */}
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCustomTag} 
                      variant="outline"
                      disabled={!customTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams in charge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Teams in charge</CardTitle>
              <p className="text-sm text-gray-600">
                Manage who is responsible for this procedure
              </p>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Start typing...</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map(team => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Procedure Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Procedure Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.is_global ? "public" : "private"}
                onValueChange={(value) => onUpdate({ is_global: value === "public" })}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="private" id="private" className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="private" className="font-medium text-gray-900">
                      Keep Private
                    </Label>
                    <p className="text-sm text-gray-600">
                      This Procedure will only be visible to your teammates at MaintainX.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="public" className="font-medium text-gray-900">
                      Make Public
                    </Label>
                    <p className="text-sm text-gray-600">
                      Publish this Procedure to the Global Procedure Library for everyone in the MaintainX Community to see.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
