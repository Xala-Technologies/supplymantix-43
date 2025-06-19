
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  Edit, 
  Trash2,
  Activity,
  Package
} from "lucide-react";

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

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AssetCard = ({ asset, isSelected, onSelect, onEdit, onDelete }: AssetCardProps) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'production_equipment':
        return '🏭';
      case 'material_handling':
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
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg group",
        isSelected 
          ? "ring-2 ring-blue-500 bg-blue-50/50 border-blue-200" 
          : "hover:border-gray-300"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{getCategoryIcon(asset.category)}</span>
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                {asset.name}
              </h3>
              <p className="text-sm text-gray-600">#{asset.tag}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", getCriticalityColor(asset.criticality))} />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status and Location */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={cn("text-xs border", getStatusColor(asset.status))}>
            <Activity className="w-3 h-3 mr-1" />
            {asset.status.replace('_', ' ')}
          </Badge>
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            {asset.location}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
              <Calendar className="w-3 h-3" />
              <span>Next PM</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{asset.nextMaintenance}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
              <Wrench className="w-3 h-3" />
              <span>Open WOs</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{asset.workOrders}</p>
          </div>
        </div>

        {/* Downtime Alert */}
        {asset.totalDowntime !== '0h' && (
          <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-red-700">
              <AlertTriangle className="w-3 h-3" />
              <span>Downtime: {asset.totalDowntime}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
