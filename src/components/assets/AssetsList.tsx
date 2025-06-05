
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Wrench, AlertTriangle } from "lucide-react";

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
}

export const AssetsList = ({ assets, selectedAssetId, onSelectAsset }: AssetsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out of service':
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'production equipment':
        return '🏭';
      case 'material handling':
        return '📦';
      case 'hvac':
        return '❄️';
      case 'electrical':
        return '⚡';
      case 'safety':
        return '🛡️';
      default:
        return '🔧';
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 xl:w-[28rem] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Assets ({assets.length})
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>Sort: Name A-Z</span>
            <button className="text-gray-400 hover:text-gray-600">↻</button>
          </div>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedAssetId === asset.id 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
              onClick={() => onSelectAsset(asset.id)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getCategoryIcon(asset.category)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Title and Criticality */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                        {asset.name}
                      </h4>
                      <span className="text-xs text-gray-600">#{asset.tag}</span>
                    </div>
                    <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getCriticalityColor(asset.criticality))} />
                  </div>
                  
                  {/* Status and Category */}
                  <div className="flex flex-col gap-2 mb-3">
                    <Badge className={cn("text-xs w-fit border", getStatusColor(asset.status))}>
                      {asset.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{asset.location}</span>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Next PM:</span>
                      </div>
                      <span className="text-gray-700 font-medium">{asset.nextMaintenance}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Wrench className="w-3 h-3" />
                        <span>Open WOs:</span>
                      </div>
                      <span className="text-gray-700 font-medium">{asset.workOrders}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Downtime:</span>
                      </div>
                      <span className="text-gray-700 font-medium">{asset.totalDowntime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
