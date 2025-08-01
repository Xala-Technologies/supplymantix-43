import React from 'react';
import { Asset } from '@/hooks/useAssets';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, MapPin, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetsListPanelProps {
  assets: Asset[];
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
}

export const AssetsListPanel: React.FC<AssetsListPanelProps> = ({
  assets,
  selectedAsset,
  onSelectAsset
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repair':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'retired':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Assets</h2>
        <p className="text-sm text-muted-foreground">{assets.length} total</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {assets.map((asset) => {
            const isSelected = selectedAsset === asset.id;
            
            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  isSelected 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:bg-accent/50"
                )}
              >
                <div className="space-y-3">
                  {/* Header with status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {asset.name || 'Untitled Asset'}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {asset.asset_tag || `AST-${asset.id.slice(-6)}`}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs ml-2 flex-shrink-0", getStatusColor(asset.status))}
                    >
                      {asset.status || 'Unknown'}
                    </Badge>
                  </div>

                  {/* Criticality */}
                  <div className="flex items-center gap-2">
                    {asset.criticality && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCriticalityColor(asset.criticality))}
                      >
                        {asset.criticality}
                      </Badge>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    {asset.category && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{asset.category}</span>
                      </div>
                    )}
                    
                    {asset.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{asset.location}</span>
                      </div>
                    )}

                    {asset.manufacturer && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span className="truncate">{asset.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};