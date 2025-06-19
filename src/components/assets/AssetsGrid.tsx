
import React from "react";
import { AssetCard } from "./AssetCard";
import { AssetsEmptyState } from "./AssetsEmptyState";

interface Asset {
  id: string;
  name: string;
  tag: string;
  status: string;
  location: string;
  category: string;
  criticality: string;
  nextMaintenance: string;
  workOrders: number;
  totalDowntime: string;
}

interface AssetsGridProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  onCreateAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  isLoading?: boolean;
}

export const AssetsGrid = ({ 
  assets, 
  selectedAssetId, 
  onSelectAsset, 
  onCreateAsset,
  onEditAsset,
  onDeleteAsset,
  isLoading 
}: AssetsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return <AssetsEmptyState onCreateAsset={onCreateAsset} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          isSelected={selectedAssetId === asset.id}
          onSelect={() => onSelectAsset(asset.id)}
          onEdit={() => onEditAsset(asset)}
          onDelete={() => onDeleteAsset(asset)}
        />
      ))}
    </div>
  );
};
