
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronDown, X, Plus } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { useLocations } from '@/hooks/useLocations';
import { useCategories } from '@/hooks/useCategories';
import { useTeams } from '@/hooks/useTeams';

interface ProcedureSettingsContentProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    asset_ids?: string[];
    location_ids?: string[];
    team_ids?: string[];
  };
  onUpdate: (updates: Partial<ProcedureSettingsContentProps['formData']>) => void;
}

const FALLBACK_CATEGORIES = [
  'Inspection',
  'Safety',
  'Calibration',
  'Reactive Maintenance',
  'Preventive Maintenance',
  'Quality Control',
  'Training',
  'Other'
];

const FALLBACK_TEAMS = [
  'Maintenance Team',
  'Operations Team',
  'Safety Team',
  'Quality Control Team',
  'Engineering Team'
];

export const ProcedureSettingsContent: React.FC<ProcedureSettingsContentProps> = ({
  formData,
  onUpdate
}) => {
  const [customTag, setCustomTag] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  
  // Fetch real data from the database
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: teams, isLoading: teamsLoading } = useTeams();

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

  const handleAssetToggle = (assetId: string) => {
    const currentAssets = formData.asset_ids || [];
    const newAssets = currentAssets.includes(assetId)
      ? currentAssets.filter(id => id !== assetId)
      : [...currentAssets, assetId];
    
    onUpdate({ asset_ids: newAssets });
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = formData.location_ids || [];
    const newLocations = currentLocations.includes(locationId)
      ? currentLocations.filter(id => id !== locationId)
      : [...currentLocations, locationId];
    
    onUpdate({ location_ids: newLocations });
  };

  const handleTeamToggle = (teamId: string) => {
    const currentTeams = formData.team_ids || [];
    const newTeams = currentTeams.includes(teamId)
      ? currentTeams.filter(id => id !== teamId)
      : [...currentTeams, teamId];
    
    onUpdate({ team_ids: newTeams });
  };

  const getSelectedAssetNames = () => {
    if (!assets || !formData.asset_ids) return [];
    return assets
      .filter(asset => formData.asset_ids?.includes(asset.id))
      .map(asset => asset.name);
  };

  const getSelectedLocationNames = () => {
    if (!locations || !formData.location_ids) return [];
    return locations
      .filter(location => formData.location_ids?.includes(location.id))
      .map(location => location.name);
  };

  const getSelectedTeamNames = () => {
    if (!teams || !formData.team_ids) return [];
    return teams
      .filter(team => formData.team_ids?.includes(team.id))
      .map(team => team.name);
  };

  const filteredAssets = assets?.filter(asset =>
    asset.name.toLowerCase().includes(assetSearch.toLowerCase())
  ) || [];

  const filteredLocations = locations?.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  ) || [];

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  ) || [];

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl space-y-8">
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
                <SelectContent className="bg-white z-50">
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : (
                    <>
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {FALLBACK_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Assets */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Assets</Label>
              <div className="space-y-3">
                {/* Selected Assets */}
                {getSelectedAssetNames().length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {getSelectedAssetNames().map(assetName => (
                      <Badge key={assetName} variant="secondary" className="flex items-center gap-1">
                        {assetName}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-600" 
                          onClick={() => {
                            const asset = assets?.find(a => a.name === assetName);
                            if (asset) handleAssetToggle(asset.id);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Select>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Search and select assets...</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <div className="p-2">
                      <Input
                        placeholder="Search assets..."
                        value={assetSearch}
                        onChange={(e) => setAssetSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {assetsLoading ? (
                      <div className="p-2 text-sm text-gray-500">Loading assets...</div>
                    ) : filteredAssets.length > 0 ? (
                      filteredAssets.map(asset => (
                        <div key={asset.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                          <Checkbox
                            checked={formData.asset_ids?.includes(asset.id) || false}
                            onCheckedChange={() => handleAssetToggle(asset.id)}
                          />
                          <label className="text-sm cursor-pointer flex-1">
                            {asset.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No assets found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Locations */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Locations</Label>
              <div className="space-y-3">
                {/* Selected Locations */}
                {getSelectedLocationNames().length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {getSelectedLocationNames().map(locationName => (
                      <Badge key={locationName} variant="secondary" className="flex items-center gap-1">
                        {locationName}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-600" 
                          onClick={() => {
                            const location = locations?.find(l => l.name === locationName);
                            if (location) handleLocationToggle(location.id);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Select>
                  <SelectTrigger className="h-11">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Search and select locations...</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <div className="p-2">
                      <Input
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {locationsLoading ? (
                      <div className="p-2 text-sm text-gray-500">Loading locations...</div>
                    ) : filteredLocations.length > 0 ? (
                      filteredLocations.map(location => (
                        <div key={location.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                          <Checkbox
                            checked={formData.location_ids?.includes(location.id) || false}
                            onCheckedChange={() => handleLocationToggle(location.id)}
                          />
                          <label className="text-sm cursor-pointer flex-1">
                            {location.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No locations found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
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
                    <Plus className="h-4 w-4 mr-1" />
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
            <div className="space-y-3">
              {/* Selected Teams */}
              {getSelectedTeamNames().length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {getSelectedTeamNames().map(teamName => (
                    <Badge key={teamName} variant="secondary" className="flex items-center gap-1">
                      {teamName}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-600" 
                        onClick={() => {
                          const team = teams?.find(t => t.name === teamName);
                          if (team) handleTeamToggle(team.id);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <Select>
                <SelectTrigger className="h-11">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Search and select teams...</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <div className="p-2">
                    <Input
                      placeholder="Search teams..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {teamsLoading ? (
                    <div className="p-2 text-sm text-gray-500">Loading teams...</div>
                  ) : filteredTeams.length > 0 ? (
                    filteredTeams.map(team => (
                      <div key={team.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                        <Checkbox
                          checked={formData.team_ids?.includes(team.id) || false}
                          onCheckedChange={() => handleTeamToggle(team.id)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {team.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No teams found</div>
                  )}
                  
                  {/* Fallback teams if no real teams exist */}
                  {(!teams || teams.length === 0) && !teamsLoading && (
                    <>
                      <div className="px-2 py-1 text-xs text-gray-400 border-t">Suggested Teams:</div>
                      {FALLBACK_TEAMS.filter(team => 
                        team.toLowerCase().includes(teamSearch.toLowerCase())
                      ).map(team => (
                        <div key={team} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                          <span className="text-sm text-gray-600 px-2">{team}</span>
                        </div>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
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
        <div className="h-16"></div>
      </div>
    </div>
  );
};
