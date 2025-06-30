
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, Globe, Lock, Tag, Users, Package, MapPin } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { useLocations } from '@/hooks/useLocations';
import { useOrganizationMembers } from '@/hooks/useOrganizations';

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

export const ProcedureSettingsEnhanced: React.FC<ProcedureSettingsEnhancedProps> = ({
  formData,
  onUpdate
}) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');

  // Fetch real data
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  const { data: organizationMembers = [], isLoading: membersLoading } = useOrganizationMembers(''); // Will need org ID

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

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(assetSearch.toLowerCase())
  );

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Extract unique teams/departments from organization members
  const teams = [...new Set(organizationMembers.map(member => member.role))].filter(Boolean);
  const filteredTeams = teams.filter(team =>
    team.toLowerCase().includes(teamSearch.toLowerCase())
  );

  // Get unique asset categories from real data
  const assetCategories = [...new Set(assets.map(asset => asset.category).filter(Boolean))];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Procedure Settings</h1>
          <p className="text-gray-600">Configure your procedure's metadata and visibility settings</p>
        </div>

        {/* Tag your procedure */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Tag your procedure</CardTitle>
                <p className="text-blue-100 text-sm mt-1">
                  Add tags to this procedure so you can easily find it in your Library
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                Categories
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onUpdate({ category: value })}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select a category..." />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category} className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assets */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-green-500" />
                Assets {assetsLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
              </Label>
              <div className="relative">
                <Input
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  placeholder="Search assets..."
                  className="h-12 pl-10 border-2 border-gray-200 hover:border-green-300 transition-colors"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-4" />
              </div>
              {assetSearch && (
                <div className="max-h-32 overflow-y-auto border rounded-lg bg-gray-50">
                  {filteredAssets.map(asset => (
                    <div 
                      key={asset.id}
                      className="p-3 hover:bg-white cursor-pointer border-b last:border-b-0 transition-colors"
                      onClick={() => {
                        if (!selectedAssets.includes(asset.id)) {
                          setSelectedAssets([...selectedAssets, asset.id]);
                        }
                        setAssetSearch('');
                      }}
                    >
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.category} • {asset.location}</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedAssets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedAssets.map(assetId => {
                    const asset = assets.find(a => a.id === assetId);
                    return asset ? (
                      <Badge 
                        key={assetId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                        onClick={() => setSelectedAssets(selectedAssets.filter(id => id !== assetId))}
                      >
                        {asset.name} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Locations {locationsLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
              </Label>
              <div className="relative">
                <Input
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search locations..."
                  className="h-12 pl-10 border-2 border-gray-200 hover:border-orange-300 transition-colors"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-4" />
              </div>
              {locationSearch && (
                <div className="max-h-32 overflow-y-auto border rounded-lg bg-gray-50">
                  {filteredLocations.map(location => (
                    <div 
                      key={location.id}
                      className="p-3 hover:bg-white cursor-pointer border-b last:border-b-0 transition-colors"
                      onClick={() => {
                        if (!selectedLocations.includes(location.id)) {
                          setSelectedLocations([...selectedLocations, location.id]);
                        }
                        setLocationSearch('');
                      }}
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.location_type} • {location.address}</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLocations.map(locationId => {
                    const location = locations.find(l => l.id === locationId);
                    return location ? (
                      <Badge 
                        key={locationId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                        onClick={() => setSelectedLocations(selectedLocations.filter(id => id !== locationId))}
                      >
                        {location.name} ×
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Custom Tags */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-500" />
                Custom Tags
              </Label>
              <div className="space-y-3">
                {/* Display existing tags */}
                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50/30">
                  {formData.tags.length === 0 ? (
                    <div className="w-full text-center text-gray-500 text-sm py-4">
                      <Tag className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      No custom tags added yet
                    </div>
                  ) : (
                    formData.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-all duration-200 transform hover:scale-105" 
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
                    className="flex-1 h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-colors"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddCustomTag} 
                    variant="outline"
                    disabled={!customTag.trim()}
                    className="h-12 px-6 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                  >
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams in charge */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Teams in charge</CardTitle>
                <p className="text-green-100 text-sm mt-1">
                  Manage who is responsible for this procedure
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <Input
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Search teams..."
                className="h-12 pl-10 border-2 border-gray-200 hover:border-green-300 transition-colors"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-4" />
            </div>
            {teamSearch && (
              <div className="mt-3 max-h-32 overflow-y-auto border rounded-lg bg-gray-50">
                {filteredTeams.map(team => (
                  <div 
                    key={team}
                    className="p-3 hover:bg-white cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => {
                      if (!selectedTeams.includes(team)) {
                        setSelectedTeams([...selectedTeams, team]);
                      }
                      setTeamSearch('');
                    }}
                  >
                    <div className="font-medium capitalize">{team.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedTeams.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTeams.map(team => (
                  <Badge 
                    key={team}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                    onClick={() => setSelectedTeams(selectedTeams.filter(t => t !== team))}
                  >
                    {team.replace('_', ' ')} ×
                  </Badge>
                ))}
              </div>
            )}
            {membersLoading && (
              <div className="text-center py-4 text-gray-500 text-sm">Loading team members...</div>
            )}
          </CardContent>
        </Card>

        {/* Procedure Visibility - Fixed positioning */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Procedure Visibility</CardTitle>
                <p className="text-indigo-100 text-sm mt-1">
                  Control who can access this procedure
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <RadioGroup
              value={formData.is_global ? "public" : "private"}
              onValueChange={(value) => onUpdate({ is_global: value === "public" })}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="private" className="font-semibold text-gray-900 text-lg">
                      Keep Private
                    </Label>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    This Procedure will only be visible to your teammates in your organization. 
                    Perfect for company-specific procedures and internal processes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <RadioGroupItem value="public" id="public" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="public" className="font-semibold text-gray-900 text-lg">
                      Make Public
                    </Label>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Publish this Procedure to the Global Procedure Library for everyone in the community to see.
                    Help others by sharing your expertise and best practices.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Asset Categories - Additional section using real data */}
        {assetCategories.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Asset Categories</CardTitle>
                  <p className="text-teal-100 text-sm mt-1">
                    Available asset categories in your organization
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {assetCategories.map(category => (
                  <Badge 
                    key={category}
                    variant="outline"
                    className="px-3 py-1 bg-teal-50 text-teal-700 border-teal-200"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
