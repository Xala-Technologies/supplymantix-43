
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetsSection } from './settings/AssetsSection';
import { LocationsSection } from './settings/LocationsSection';
import { TeamsSection } from './settings/TeamsSection';
import { CustomTagsSection } from './settings/CustomTagsSection';
import { VisibilitySection } from './settings/VisibilitySection';

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

export const ProcedureSettingsContent: React.FC<ProcedureSettingsContentProps> = ({
  formData,
  onUpdate
}) => {
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

  const handleAddTag = (tag: string) => {
    onUpdate({
      tags: [...formData.tags, tag]
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleVisibilityChange = (isGlobal: boolean) => {
    onUpdate({ is_global: isGlobal });
  };

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
            <AssetsSection
              selectedAssetIds={formData.asset_ids || []}
              onAssetToggle={handleAssetToggle}
            />

            <LocationsSection
              selectedLocationIds={formData.location_ids || []}
              onLocationToggle={handleLocationToggle}
            />

            <CustomTagsSection
              tags={formData.tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
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
            <TeamsSection
              selectedTeamIds={formData.team_ids || []}
              onTeamToggle={handleTeamToggle}
            />
          </CardContent>
        </Card>

        {/* Procedure Visibility */}
        <VisibilitySection
          isGlobal={formData.is_global}
          onVisibilityChange={handleVisibilityChange}
        />

        {/* Bottom padding for better scrolling */}
        <div className="h-16"></div>
      </div>
    </div>
  );
};
