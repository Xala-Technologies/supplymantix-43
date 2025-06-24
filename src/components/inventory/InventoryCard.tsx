
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Edit, 
  Eye
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  unitCost: number;
  totalValue: number;
  location?: string;
  category?: string;
  status: string;
}

interface InventoryCardProps {
  item: InventoryItem;
  onView?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
}

export const InventoryCard = ({ item, onView, onEdit }: InventoryCardProps) => {
  const isLowStock = item.quantity <= item.minQuantity;
  
  const getStatusColor = () => {
    if (item.quantity === 0) return "destructive";
    if (isLowStock) return "secondary";
    return "default";
  };

  const getStatusText = () => {
    if (item.quantity === 0) return "Out of Stock";
    if (isLowStock) return "Low Stock";
    return "In Stock";
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isLowStock ? 'border-orange-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {item.name}
            </CardTitle>
            {item.sku && (
              <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {isLowStock && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-medium">{item.quantity}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Unit Cost</p>
              <p className="font-medium">${item.unitCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {item.location && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{item.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-lg font-bold text-gray-900">${item.totalValue.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(item)}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
