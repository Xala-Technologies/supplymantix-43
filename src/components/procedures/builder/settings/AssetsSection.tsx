
import React from 'react';
import { useAssets } from '@/hooks/useAssets';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface AssetsSectionProps {
  selectedAssetIds: string[];
  onAssetToggle: (assetId: string) => void;
}

export const AssetsSection: React.FC<AssetsSectionProps> = ({
  selectedAssetIds,
  onAssetToggle
}) => {
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useAssets();

  const getSelectedAssetNames = () => {
    if (!assets || !selectedAssetIds) return [];
    return assets
      .filter(asset => selectedAssetIds.includes(asset.id))
      .map(asset => asset.name);
  };

  return (
    <MultiSelectDropdown
      label="Assets"
      placeholder="Search and select assets..."
      items={assets || []}
      selectedIds={selectedAssetIds || []}
      isLoading={assetsLoading}
      error={assetsError}
      onToggle={onAssetToggle}
      onRemove={onAssetToggle}
      getSelectedNames={getSelectedAssetNames}
    />
  );
};
