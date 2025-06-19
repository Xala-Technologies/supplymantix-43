
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Filter, Search, Download, FileText, FileSpreadsheet } from "lucide-react";
import { assetsApi } from "@/lib/database/assets";
import { toast } from "sonner";

interface AssetsHeaderProps {
  onFiltersChange: (filters: {
    search: string;
    status: string[];
    category: string[];
    location: string[];
    criticality: string[];
  }) => void;
  onCreateAsset: () => void;
  assetsCount: number;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of Service" },
  { value: "retired", label: "Retired" }
];

const categoryOptions = [
  { value: "equipment", label: "Equipment" },
  { value: "production_equipment", label: "Production Equipment" },
  { value: "material_handling", label: "Material Handling" },
  { value: "hvac", label: "HVAC" },
  { value: "electrical", label: "Electrical" },
  { value: "safety", label: "Safety" }
];

const locationOptions = [
  { value: "production_line_1", label: "Production Line 1" },
  { value: "production_line_2", label: "Production Line 2" },
  { value: "production_line_3", label: "Production Line 3" },
  { value: "warehouse", label: "Warehouse" },
  { value: "utility_room", label: "Utility Room" },
  { value: "office", label: "Office" }
];

const criticalityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

export const AssetsHeader = ({ onFiltersChange, onCreateAsset, assetsCount }: AssetsHeaderProps) => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedCriticality, setSelectedCriticality] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const updateFilters = () => {
    onFiltersChange({
      search,
      status: selectedStatus,
      category: selectedCategory,
      location: selectedLocation,
      criticality: selectedCriticality
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({
      search: value,
      status: selectedStatus,
      category: selectedCategory,
      location: selectedLocation,
      criticality: selectedCriticality
    });
  };

  const toggleFilter = (
    filterArray: string[],
    setterFunction: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    let newArray;
    if (filterArray.includes(value)) {
      newArray = filterArray.filter(item => item !== value);
    } else {
      newArray = [...filterArray, value];
    }
    setterFunction(newArray);
    
    // Update filters immediately
    const updatedFilters = {
      search,
      status: filterArray === selectedStatus ? newArray : selectedStatus,
      category: filterArray === selectedCategory ? newArray : selectedCategory,
      location: filterArray === selectedLocation ? newArray : selectedLocation,
      criticality: filterArray === selectedCriticality ? newArray : selectedCriticality
    };
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedStatus([]);
    setSelectedCategory([]);
    setSelectedLocation([]);
    setSelectedCriticality([]);
    onFiltersChange({
      search: "",
      status: [],
      category: [],
      location: [],
      criticality: []
    });
  };

  const getTotalActiveFilters = () => {
    return selectedStatus.length + selectedCategory.length + selectedLocation.length + selectedCriticality.length + (search ? 1 : 0);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const exportData = await assetsApi.exportAssets(format);
      
      // Create and download file
      const blob = new Blob([exportData], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `assets-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Assets exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export assets');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4">
        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your organization's assets ({assetsCount} total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={onCreateAsset}>
              <Plus className="w-4 h-4 mr-2" />
              New Asset
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets by name or tag..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {getTotalActiveFilters() > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600">
                      {getTotalActiveFilters()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {getTotalActiveFilters() > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <div className="space-y-2">
                      {statusOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${option.value}`}
                            checked={selectedStatus.includes(option.value)}
                            onCheckedChange={() => toggleFilter(selectedStatus, setSelectedStatus, option.value)}
                          />
                          <label htmlFor={`status-${option.value}`} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="space-y-2">
                      {categoryOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${option.value}`}
                            checked={selectedCategory.includes(option.value)}
                            onCheckedChange={() => toggleFilter(selectedCategory, setSelectedCategory, option.value)}
                          />
                          <label htmlFor={`category-${option.value}`} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <div className="space-y-2">
                      {locationOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${option.value}`}
                            checked={selectedLocation.includes(option.value)}
                            onCheckedChange={() => toggleFilter(selectedLocation, setSelectedLocation, option.value)}
                          />
                          <label htmlFor={`location-${option.value}`} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Criticality Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Criticality</label>
                    <div className="space-y-2">
                      {criticalityOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`criticality-${option.value}`}
                            checked={selectedCriticality.includes(option.value)}
                            onCheckedChange={() => toggleFilter(selectedCriticality, setSelectedCriticality, option.value)}
                          />
                          <label htmlFor={`criticality-${option.value}`} className="text-sm">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {getTotalActiveFilters() > 0 && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{search}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedStatus.map((status) => (
              <Badge key={`status-${status}`} variant="secondary" className="flex items-center gap-1">
                Status: {statusOptions.find(s => s.value === status)?.label}
                <button
                  onClick={() => toggleFilter(selectedStatus, setSelectedStatus, status)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedCategory.map((category) => (
              <Badge key={`category-${category}`} variant="secondary" className="flex items-center gap-1">
                Category: {categoryOptions.find(c => c.value === category)?.label}
                <button
                  onClick={() => toggleFilter(selectedCategory, setSelectedCategory, category)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedLocation.map((location) => (
              <Badge key={`location-${location}`} variant="secondary" className="flex items-center gap-1">
                Location: {locationOptions.find(l => l.value === location)?.label}
                <button
                  onClick={() => toggleFilter(selectedLocation, setSelectedLocation, location)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedCriticality.map((criticality) => (
              <Badge key={`criticality-${criticality}`} variant="secondary" className="flex items-center gap-1">
                Criticality: {criticalityOptions.find(c => c.value === criticality)?.label}
                <button
                  onClick={() => toggleFilter(selectedCriticality, setSelectedCriticality, criticality)}
                  className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
