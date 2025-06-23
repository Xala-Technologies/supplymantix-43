
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Search, 
  Filter, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Zap,
  Download,
  Upload,
  MoreHorizontal
} from "lucide-react";

interface MetersHeaderProps {
  onCreateMeter: () => void;
  onImport?: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: (selected: boolean) => void;
}

export const MetersHeader = ({
  onCreateMeter,
  onImport,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter = "all",
  onStatusFilterChange,
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
}: MetersHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meters Management</h1>
          <p className="text-gray-600 mt-1">Monitor and track your asset performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {onImport && (
            <Button variant="outline" onClick={onImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          )}
          
          <Button onClick={onCreateMeter} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Meter
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Bulk Selection */}
            {onSelectAll && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCount === totalCount && totalCount > 0}
                  onCheckedChange={onSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
                </span>
              </div>
            )}

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search meters by name, location, or asset..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger className="w-40">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manual">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manual
                    </div>
                  </SelectItem>
                  <SelectItem value="automated">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Automated
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {onStatusFilterChange && (
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                  <SelectTrigger className="w-40">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Warning
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
