import React from "react";
import { UnifiedCard } from "@/components/Layout/UnifiedCard";
import { GridLayout } from "@/components/Layout/GridLayout";
import { AssetsEmptyState } from "./AssetsEmptyState";
import { Calendar, Wrench, MapPin, Package } from "lucide-react";

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
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_service':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    return <Package className="w-5 h-5 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <GridLayout cols={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </GridLayout>
    );
  }

  if (assets.length === 0) {
    return <AssetsEmptyState onCreateAsset={onCreateAsset} />;
  }

  return (
    <GridLayout cols={4}>
      {assets.map((asset) => (
        <UnifiedCard
          key={asset.id}
          title={asset.name}
          subtitle={`#${asset.tag}`}
          status={asset.status.replace('_', ' ')}
          statusColor={getStatusColor(asset.status)}
          icon={getCategoryIcon(asset.category)}
          isSelected={selectedAssetId === asset.id}
          onClick={() => onSelectAsset(asset.id)}
          onEdit={() => onEditAsset(asset)}
          onDelete={() => onDeleteAsset(asset)}
          badges={[
            {
              label: asset.location,
              color: "bg-blue-50 text-blue-700 border-blue-200"
            }
          ]}
          metrics={[
            {
              label: "Next PM",
              value: asset.nextMaintenance,
              icon: <Calendar className="w-3 h-3" />
            },
            {
              label: "Open WOs",
              value: asset.workOrders.toString(),
              icon: <Wrench className="w-3 h-3" />
            }
          ]}
        />
      ))}
    </GridLayout>
  );
};
