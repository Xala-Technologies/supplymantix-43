
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, Download, MapPin, Tag, AlertTriangle, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterState {
  search: string;
  status: string[];
  category: string[];
  location: string[];
  criticality: string[];
}

interface AssetsHeaderProps {
  onFiltersChange: (filters: FilterState) => void;
  onCreateAsset: () => void;
  assetsCount: number;
}

export const AssetsHeader = ({ onFiltersChange, onCreateAsset, assetsCount }: AssetsHeaderProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    category: [],
    location: [],
    criticality: [],
  });

  const statusOptions = ["active", "maintenance", "out_of_service", "retired"];
  const categoryOptions = ["equipment", "production_equipment", "material_handling", "hvac", "electrical", "safety"];
  const locationOptions = ["production_line_1", "production_line_2", "production_line_3", "utility_room", "warehouse"];
  const criticalityOptions = ["high", "medium", "low"];

  const handleMultiSelectFilter = (filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newFilters = {
        ...prev,
        [filterType]: checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value)
      };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      status: [],
      category: [],
      location: [],
      criticality: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const removeFilter = (filterType: string, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: (prev[filterType as keyof FilterState] as string[]).filter(v => v !== value)
      };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.criticality.length > 0) count++;
    return count;
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="p-4 lg:p-6">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">{assetsCount} Total</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search Assets" 
                className="pl-10 w-full sm:w-64"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={onCreateAsset}>
                <Plus className="h-4 w-4 mr-2" />
                New Asset
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filter row */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
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
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <Tag className="h-4 w-4 mr-2" />
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
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <MapPin className="h-4 w-4 mr-2" />
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
                    {location.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Criticality Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  Criticality
                  {filters.criticality.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.criticality.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Criticality</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {criticalityOptions.map((criticality) => (
                  <DropdownMenuCheckboxItem
                    key={criticality}
                    checked={filters.criticality.includes(criticality)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('criticality', criticality, checked)}
                  >
                    {criticality.charAt(0).toUpperCase() + criticality.slice(1)}
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
          {(filters.status.length > 0 || filters.category.length > 0 || 
            filters.location.length > 0 || filters.criticality.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              
              {filters.status.map((status) => (
                <Badge key={status} variant="secondary" className="text-xs">
                  Status: {status.replace('_', ' ')}
                  <button 
                    onClick={() => removeFilter('status', status)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.category.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  Category: {category.replace('_', ' ')}
                  <button 
                    onClick={() => removeFilter('category', category)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.location.map((location) => (
                <Badge key={location} variant="secondary" className="text-xs">
                  Location: {location.replace('_', ' ')}
                  <button 
                    onClick={() => removeFilter('location', location)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.criticality.map((criticality) => (
                <Badge key={criticality} variant="secondary" className="text-xs">
                  Criticality: {criticality}
                  <button 
                    onClick={() => removeFilter('criticality', criticality)}
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
