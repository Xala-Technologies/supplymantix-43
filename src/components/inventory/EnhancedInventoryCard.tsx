
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
  Eye,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

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

interface EnhancedInventoryCardProps {
  item: InventoryItem;
  onView?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  selected?: boolean;
  compact?: boolean;
}

export const EnhancedInventoryCard = ({
  item,
  onView,
  onEdit,
  selected = false,
  compact = false
}: EnhancedInventoryCardProps) => {
  const isLowStock = item.quantity <= item.minQuantity;
  const stockPercentage = item.minQuantity > 0 ? (item.quantity / item.minQuantity) * 100 : 100;
  
  if (compact) {
    return (
      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <InventoryStatusBadge 
                  quantity={item.quantity} 
                  minQuantity={item.minQuantity} 
                />
              </div>
              <p className="text-sm text-gray-500 truncate">{item.sku}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {item.quantity}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${item.unitCost.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(item);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
      selected ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${isLowStock ? 'border-orange-200 bg-orange-50/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </CardTitle>
              <InventoryStatusBadge 
                quantity={item.quantity} 
                minQuantity={item.minQuantity} 
              />
            </div>
            {item.sku && (
              <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
            )}
          </div>
          
          {isLowStock && (
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 ml-2" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Stock Level Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Stock Level</span>
            <span className="text-sm text-gray-600">
              {item.quantity} / min {item.minQuantity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isLowStock ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Item Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">{item.quantity}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Unit Cost</p>
              <p className="font-medium text-gray-900">${item.unitCost.toFixed(2)}</p>
            </div>
          </div>
          
          {item.location && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-900 truncate">{item.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Value and Trend */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-lg font-bold text-gray-900">${item.totalValue.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center gap-1">
            {stockPercentage > 100 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-orange-500" />
            )}
            <span className={`text-sm font-medium ${
              stockPercentage > 100 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {stockPercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onView(item);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
