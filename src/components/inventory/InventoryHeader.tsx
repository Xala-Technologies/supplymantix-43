
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
  ShoppingCart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAutoReorderCheck } from "@/hooks/useInventoryReorder";
import type { InventoryItemWithStats } from "@/lib/database/inventory-enhanced";

interface InventoryHeaderProps {
  onCreateItem: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
  totalItems?: number;
  lowStockCount?: number;
  items?: InventoryItemWithStats[];
}

export const InventoryHeader = ({
  onCreateItem,
  searchQuery,
  onSearchChange,
  onFilterClick,
  onExportClick,
  totalItems = 0,
  lowStockCount = 0,
  items = []
}: InventoryHeaderProps) => {
  const autoReorderCheck = useAutoReorderCheck();

  const handleAutoReorderCheck = () => {
    if (items.length > 0) {
      autoReorderCheck.mutate(items);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">
              Manage your inventory items and stock levels
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoReorderCheck}
                disabled={autoReorderCheck.isPending}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Check Reorder ({lowStockCount})
              </Button>
            )}
            
            <Button onClick={onCreateItem} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={onFilterClick}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

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

            <Button variant="outline" size="sm" onClick={onExportClick}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
