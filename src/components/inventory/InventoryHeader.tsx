
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Loader2,
  Grid3X3,
  List
} from "lucide-react";

interface InventoryHeaderProps {
  onCreateItem: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onFilterChange?: (type: string, value: string) => void;
  statusFilter?: string;
  locationFilter?: string;
  locations?: string[];
  totalItems?: number;
  lowStockCount?: number;
  isLoading?: boolean;
  isExporting?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export const InventoryHeader = ({
  onCreateItem,
  searchQuery,
  onSearchChange,
  onRefresh,
  onExport,
  onFilterChange,
  statusFilter = "all",
  locationFilter = "all",
  locations = [],
  totalItems = 0,
  lowStockCount = 0,
  isLoading = false,
  isExporting = false,
  viewMode = 'grid',
  onViewModeChange
}: InventoryHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            {totalItems} items total • {lowStockCount} low stock alerts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {onExport && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          )}
          
          <Button onClick={onCreateItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, SKU, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {onFilterChange && (
          <>
            <Select value={statusFilter} onValueChange={(value) => onFilterChange('status', value)}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={(value) => onFilterChange('location', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            {onViewModeChange && (
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('grid')}
                  className={`px-3 py-1.5 text-xs ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
                  Cards
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('list')}
                  className={`px-3 py-1.5 text-xs ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-3.5 w-3.5 mr-1.5" />
                  List
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
