import React from 'react';
import { Asset } from '@/hooks/useAssets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Package, MapPin, User, Calendar, DollarSign, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetDetailPanelProps {
  asset: Asset;
  onEditAsset: () => void;
}

export const AssetDetailPanel: React.FC<AssetDetailPanelProps> = ({
  asset,
  onEditAsset
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

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold truncate">{asset.name}</h1>
              <Badge variant="outline" className={cn("", getStatusColor(asset.status))}>
                {asset.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {asset.asset_tag || `AST-${asset.id.slice(-6)}`}
            </p>
          </div>
          <Button 
            onClick={onEditAsset}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Category:</span>
                    <span>{asset.category || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{asset.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Manufacturer:</span>
                    <span>{asset.manufacturer || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Model:</span>
                    <span>{asset.model || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Serial Number:</span>
                    <span>{asset.serial_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Criticality:</span>
                    <Badge variant="outline" className={cn("text-xs", 
                      asset.criticality?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                      asset.criticality?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      asset.criticality?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    )}>
                      {asset.criticality || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Purchase Price:</span>
                    <span>{formatCurrency(asset.purchase_price)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Annual Depreciation:</span>
                    <span>{formatCurrency(asset.annual_depreciation_value)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Purchase Date:</span>
                    <span>{formatDate(asset.purchase_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Year:</span>
                    <span>{asset.year || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">VIN Number:</span>
                    <span>{asset.vin_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Vendor:</span>
                    <span>{asset.vendor || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Asset Type:</span>
                    <span>{asset.asset_type || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Warranty End:</span>
                    <span>{formatDate(asset.warranty_end_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Replacement Date:</span>
                    <span>{formatDate(asset.replacement_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">QR Code:</span>
                    <span>{asset.qr_code || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};