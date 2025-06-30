
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
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="min-h-full flex justify-center py-8">
        <div className="w-full max-w-2xl px-6 space-y-8">
          {/* Tag your procedure */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Tag your procedure</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Add tags to this procedure so you can easily find it on your Library
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Categories</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => onUpdate({ category: value })}
                >
                  <SelectTrigger className="h-11">
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
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Assets</Label>
                <Select>
                  <SelectTrigger className="h-11">
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
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Locations</Label>
                <Select>
                  <SelectTrigger className="h-11">
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
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Custom Tags</Label>
                <div className="space-y-3">
                  {/* Display existing tags */}
                  <div className="flex flex-wrap gap-2 min-h-[48px] p-4 border border-gray-200 rounded-lg bg-white">
                    {formData.tags.length === 0 ? (
                      <span className="text-gray-500 text-sm flex items-center">No custom tags</span>
                    ) : (
                      formData.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors px-3 py-1" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))
                    )}
                  </div>
                  
                  {/* Add new tag */}
                  <div className="flex gap-3">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      className="flex-1 h-11"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCustomTag} 
                      variant="outline"
                      disabled={!customTag.trim()}
                      className="h-11 px-6"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams in charge */}
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Teams in charge</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage who is responsible for this procedure
              </p>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="h-11">
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
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Procedure Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.is_global ? "public" : "private"}
                onValueChange={(value) => onUpdate({ is_global: value === "public" })}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="private" id="private" className="mt-1" />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="private" className="font-medium text-gray-900 cursor-pointer">
                      Keep Private
                    </Label>
                    <p className="text-sm text-gray-600">
                      This Procedure will only be visible to your teammates at MaintainX.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="public" className="font-medium text-gray-900 cursor-pointer">
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

          {/* Bottom padding for better scrolling */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
