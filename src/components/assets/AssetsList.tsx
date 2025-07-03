
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Wrench, Edit, Trash2, MoreHorizontal, Eye, Package } from "lucide-react";

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

interface AssetsListProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  onEditAsset?: (asset: Asset) => void;
  onDeleteAsset?: (asset: Asset) => void;
}

export const AssetsList = ({ 
  assets, 
  selectedAssetId, 
  onSelectAsset,
  onEditAsset,
  onDeleteAsset 
}: AssetsListProps) => {
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

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          <div className="flex-1">Asset</div>
          <div className="hidden md:block w-24 text-center">Status</div>
          <div className="hidden md:block w-32 text-center">Location</div>
          <div className="hidden md:block w-24 text-center">Next PM</div>
          <div className="hidden md:block w-20 text-center">WOs</div>
          <div className="w-24 text-center">Actions</div>
        </div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-gray-100">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className={cn(
              "px-6 py-4 transition-colors cursor-pointer",
              selectedAssetId === asset.id ? "bg-blue-50" : "hover:bg-gray-50"
            )}
            onClick={() => onSelectAsset(asset.id)}
          >
            <div className="flex items-center justify-between">
              {/* Asset Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset.id);
                      }}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                    >
                      {asset.name}
                      <Eye className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <p className="text-sm text-gray-500">#{asset.tag}</p>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0 ml-2", getCriticalityColor(asset.criticality))} />
                </div>
              </div>

              {/* Status - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <Badge className={cn("text-xs border", getStatusColor(asset.status))}>
                  {asset.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Location - Hidden on mobile */}
              <div className="hidden md:flex w-32 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{asset.location}</span>
                </div>
              </div>

              {/* Next PM - Hidden on mobile */}
              <div className="hidden md:flex w-24 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{asset.nextMaintenance}</span>
                </div>
              </div>

              {/* Work Orders - Hidden on mobile */}
              <div className="hidden md:flex w-20 justify-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Wrench className="h-3 w-3" />
                  <span>{asset.workOrders}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-24 justify-center">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAsset(asset.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                {(onEditAsset || onDeleteAsset) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {onEditAsset && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditAsset(asset);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDeleteAsset && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAsset(asset);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
