
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Filter, Download, Package, AlertTriangle, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterState {
  search: string;
  category: string[];
  status: string[];
  location: string[];
}

export const InventoryHeader = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: [],
    status: [],
    location: [],
  });

  const categoryOptions = ["Filters", "Safety Equipment", "Electrical", "Mechanical", "Consumables"];
  const statusOptions = ["In Stock", "Low Stock", "Out of Stock", "On Order"];
  const locationOptions = ["Warehouse A", "Warehouse B", "Safety Storage Room", "Tool Crib", "Production Floor"];

  const handleMultiSelectFilter = (filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: [],
      status: [],
      location: [],
    });
  };

  const removeFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType as keyof FilterState] as string[]).filter(v => v !== value)
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.location.length > 0) count++;
    return count;
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="p-4 lg:p-6">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">📦</Badge>
              <Badge variant="outline" className="text-xs">📊</Badge>
              <Badge variant="outline" className="text-xs">⚠️</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search Inventory" 
                className="pl-10 w-full sm:w-64"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filter row */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <Package className="h-4 w-4 mr-2" />
                  Category
                  {filters.category.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.category.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categoryOptions.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={filters.category.includes(category)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('category', category, checked)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Status
                  {filters.status.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.status.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('status', status, checked)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  Location
                  {filters.location.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.location.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {locationOptions.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={filters.location.includes(location)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('location', location, checked)}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {getActiveFilterCount() > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All ({getActiveFilterCount()})
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(filters.category.length > 0 || filters.status.length > 0 || filters.location.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              
              {filters.category.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  Category: {category}
                  <button 
                    onClick={() => removeFilter('category', category)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.status.map((status) => (
                <Badge key={status} variant="secondary" className="text-xs">
                  Status: {status}
                  <button 
                    onClick={() => removeFilter('status', status)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.location.map((location) => (
                <Badge key={location} variant="secondary" className="text-xs">
                  Location: {location}
                  <button 
                    onClick={() => removeFilter('location', location)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
