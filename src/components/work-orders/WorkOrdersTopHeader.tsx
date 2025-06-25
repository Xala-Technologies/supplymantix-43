
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid2x2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkOrderFilters } from "@/types/workOrder";
import { Dispatch, SetStateAction } from "react";

interface WorkOrdersTopHeaderProps {
  workOrdersCount: number;
  totalCount: number;
  filters: WorkOrderFilters;
  onFiltersChange: Dispatch<SetStateAction<WorkOrderFilters>>;
  onCreateWorkOrder: () => void;
  viewMode?: 'list' | 'calendar';
  onViewModeChange?: (mode: 'list' | 'calendar') => void;
}

export const WorkOrdersTopHeader = ({
  workOrdersCount,
  totalCount,
  filters,
  onFiltersChange,
  onCreateWorkOrder,
  viewMode = 'list',
  onViewModeChange
}: WorkOrdersTopHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
            <p className="text-sm text-gray-600 mt-1">
              Showing {workOrdersCount} of {totalCount} work orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            {onViewModeChange && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid2x2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('calendar')}
                  className={`px-3 py-2 ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <Button onClick={onCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Work Order
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search work orders..."
              value={filters.search}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => onFiltersChange(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange(prev => ({ ...prev, category: value as any }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
