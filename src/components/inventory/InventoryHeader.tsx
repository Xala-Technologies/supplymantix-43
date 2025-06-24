
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  Package,
  ShoppingCart,
  RefreshCw,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAutoReorderCheck } from "@/hooks/useInventoryReorder";
import { useExportInventory } from "@/hooks/useInventoryExport";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";
import { Card, CardContent } from "@/components/ui/card";

interface Location {
  id: string;
  name: string;
  description?: string;
  location_code?: string;
  location_type: string;
  address?: string;
  is_active: boolean;
}

interface InventoryHeaderProps {
  // Required props for basic inventory header
  onCreateItem?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  
  // Optional props for enhanced dashboard functionality
  onFilterClick?: () => void;
  onExportClick?: () => void;
  onRefresh?: () => Promise<void>;
  onStatusFilterChange?: (status: string) => void;
  onLocationFilterChange?: (location: string) => void;
  
  // Data props
  totalItems?: number;
  lowStockCount?: number;
  items?: InventoryItemWithStats[];
  locations?: Location[];
  
  // Filter state props
  searchValue?: string;
  statusFilter?: string;
  locationFilter?: string;
  
  // Additional actions
  extraActions?: React.ReactNode;
  
  // Layout props
  showStats?: boolean;
  compact?: boolean;
}

export const InventoryHeader = ({
  onCreateItem,
  searchQuery,
  onSearchChange,
  onFilterClick,
  onExportClick,
  onRefresh,
  onStatusFilterChange,
  onLocationFilterChange,
  totalItems = 0,
  lowStockCount = 0,
  items = [],
  locations = [],
  searchValue,
  statusFilter,
  locationFilter,
  extraActions,
  showStats = false,
  compact = false
}: InventoryHeaderProps) => {
  const autoReorderCheck = useAutoReorderCheck();
  const exportInventory = useExportInventory();

  const handleAutoReorderCheck = () => {
    if (items.length > 0) {
      autoReorderCheck.mutate(items);
    }
  };

  const handleExport = () => {
    if (onExportClick) {
      onExportClick();
    } else if (items.length > 0) {
      exportInventory.mutate(items);
    }
  };

  const handleCreateItem = () => {
    if (onCreateItem) {
      onCreateItem();
    }
  };

  // Use searchQuery or searchValue depending on which is provided
  const currentSearchValue = searchQuery || searchValue || "";

  if (compact) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inventory..."
              value={currentSearchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {lowStockCount > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {lowStockCount} Low Stock
              </Badge>
            )}
            
            <Button variant="outline" size="sm" onClick={onFilterClick}>
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory items and stock levels
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Action Buttons */}
            {lowStockCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoReorderCheck}
                disabled={autoReorderCheck.isPending}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {autoReorderCheck.isPending ? 'Processing...' : `Reorder (${lowStockCount})`}
              </Button>
            )}
            
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
            
            {onCreateItem && (
              <Button onClick={handleCreateItem} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}

            {extraActions}
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={currentSearchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={onFilterClick}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>{totalItems} Items</span>
              </div>
              
              {lowStockCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {lowStockCount} Low Stock
                  </Badge>
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Optional Quick Stats */}
        {showStats && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Value</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${items.reduce((sum, item) => sum + item.total_value, 0).toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">In Stock</p>
                    <p className="text-xl font-bold text-green-900">
                      {items.filter(item => item.quantity > item.min_quantity).length}
                    </p>
                  </div>
                  <Package className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Need Reorder</p>
                    <p className="text-xl font-bold text-orange-900">
                      {items.filter(item => item.needs_reorder).length}
                    </p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Categories</p>
                    <p className="text-xl font-bold text-purple-900">
                      {new Set(items.map(item => item.location)).size}
                    </p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
