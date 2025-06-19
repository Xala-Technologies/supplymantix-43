
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download } from "lucide-react";
import { InventoryForm } from "./InventoryForm";
import { useExportInventory } from "@/hooks/useInventoryEnhanced";

interface InventoryHeaderProps {
  onSearchChange?: (search: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onLocationFilterChange?: (location: string) => void;
  onRefresh?: () => void;
  searchValue?: string;
  statusFilter?: string;
  locationFilter?: string;
  locations?: Array<{ id: string; name: string }>;
}

export const InventoryHeader = ({
  onSearchChange,
  onStatusFilterChange,
  onLocationFilterChange,
  onRefresh,
  searchValue = "",
  statusFilter = "",
  locationFilter = "",
  locations = []
}: InventoryHeaderProps) => {
  const exportMutation = useExportInventory();

  const handleExport = () => {
    console.log('Export button clicked');
    exportMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white border-b">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your inventory items and track stock levels</p>
        </div>
        
        <div className="flex gap-2">
          <InventoryForm 
            onSuccess={onRefresh}
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            }
          />
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items by name, SKU, or description..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={locationFilter} onValueChange={onLocationFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
