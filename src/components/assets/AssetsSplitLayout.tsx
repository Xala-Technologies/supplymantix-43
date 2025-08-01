import React from 'react';
import { Asset } from '@/hooks/useAssets';
import { AssetsListPanel } from './AssetsListPanel';
import { AssetDetailPanel } from './AssetDetailPanel';

interface AssetsSplitLayoutProps {
  assets: Asset[];
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
  onEditAsset: () => void;
  selectedAssetData?: Asset;
}

export const AssetsSplitLayout: React.FC<AssetsSplitLayoutProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onEditAsset,
  selectedAssetData
}) => {
  return (
    <div className="flex h-full">
      {/* Left Panel - Assets List */}
      <div className="w-80 border-r border-border bg-background">
        <AssetsListPanel
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
        />
      </div>
      
      {/* Right Panel - Asset Details */}
      <div className="flex-1 bg-background">
        {selectedAssetData ? (
          <AssetDetailPanel
            asset={selectedAssetData}
            onEditAsset={onEditAsset}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select an asset</h3>
              <p>Choose an asset from the list to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};