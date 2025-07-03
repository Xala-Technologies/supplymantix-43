import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload, Grid3X3, List } from "lucide-react";
import { toast } from "sonner";
import { exportAssetsToCSV, importAssetsFromCSV } from "@/utils/assetsImportExport";
interface AssetsHeaderProps {
  onFiltersChange: (filters: any) => void;
  onCreateAsset: () => void;
  assets?: any[]; // Add assets prop for export
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}
export const AssetsHeader = ({
  onFiltersChange,
  onCreateAsset,
  assets = [],
  viewMode = 'grid',
  onViewModeChange
}: AssetsHeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [criticalityFilter, setCriticalityFilter] = React.useState("all");
  React.useEffect(() => {
    const filters = {
      search: searchQuery,
      status: statusFilter === "all" ? [] : [statusFilter],
      category: categoryFilter === "all" ? [] : [categoryFilter],
      location: [],
      criticality: criticalityFilter === "all" ? [] : [criticalityFilter]
    };
    onFiltersChange(filters);
  }, [searchQuery, statusFilter, categoryFilter, criticalityFilter, onFiltersChange]);
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          toast.loading(`Importing ${file.name}...`);
          const importedAssets = await importAssetsFromCSV(file);
          console.log('Imported assets:', importedAssets);
          toast.success(`Successfully imported ${importedAssets.length} assets`);
          // TODO: Integrate with asset creation API
        } catch (error) {
          console.error('Import failed:', error);
          toast.error('Failed to import assets');
        }
      }
    };
    input.click();
  };
  const handleExport = () => {
    if (assets.length === 0) {
      toast.error('No assets to export');
      return;
    }
    try {
      exportAssetsToCSV(assets);
      toast.success(`Exported ${assets.length} assets to CSV`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export assets');
    }
  };
  return <div className="py-4 mx-0 px-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-9" />
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="production_equipment">Production Equipment</SelectItem>
              <SelectItem value="material_handling">Material Handling</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
            </SelectContent>
          </Select>

          <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </div>;
};