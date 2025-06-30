
import React from 'react';
import { useLocations } from '@/hooks/useLocations';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface LocationsSectionProps {
  selectedLocationIds: string[];
  onLocationToggle: (locationId: string) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  selectedLocationIds,
  onLocationToggle
}) => {
  const { data: locations, isLoading: locationsLoading, error: locationsError } = useLocations();

  const getSelectedLocationNames = () => {
    if (!locations || !selectedLocationIds) return [];
    return locations
      .filter(location => selectedLocationIds.includes(location.id))
      .map(location => location.name);
  };

  return (
    <MultiSelectDropdown
      label="Locations"
      placeholder="Search and select locations..."
      items={locations || []}
      selectedIds={selectedLocationIds || []}
      isLoading={locationsLoading}
      error={locationsError}
      onToggle={onLocationToggle}
      onRemove={onLocationToggle}
      getSelectedNames={getSelectedLocationNames}
    />
  );
};
