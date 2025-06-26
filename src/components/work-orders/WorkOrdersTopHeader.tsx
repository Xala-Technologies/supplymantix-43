
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid2x2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkOrderFilters } from "@/types/workOrder";
import { Dispatch, SetStateAction } from "react";
import { NewWorkOrderDialog } from "./NewWorkOrderDialog";

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
    <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 shadow-sm">
      {/* Main Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Work Orders
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Showing {workOrdersCount} of {totalCount} work orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            {onViewModeChange && (
              <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={`px-4 py-2 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Grid2x2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('calendar')}
                  className={`px-4 py-2 transition-all duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <NewWorkOrderDialog />
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search work orders..."
                value={filters.search}
                onChange={(e) => onFiltersChange(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 border-slate-300 focus:border-primary focus:ring-primary/20 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange(prev => ({ ...prev, status: value as any }))}
            >
              <SelectTrigger className="w-[140px] border-slate-300 focus:border-primary bg-slate-50 hover:bg-white transition-colors">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-slate-50">All Status</SelectItem>
                <SelectItem value="open" className="hover:bg-slate-50">Open</SelectItem>
                <SelectItem value="in_progress" className="hover:bg-slate-50">In Progress</SelectItem>
                <SelectItem value="completed" className="hover:bg-slate-50">Completed</SelectItem>
                <SelectItem value="on_hold" className="hover:bg-slate-50">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priority}
              onValueChange={(value) => onFiltersChange(prev => ({ ...prev, priority: value as any }))}
            >
              <SelectTrigger className="w-[140px] border-slate-300 focus:border-primary bg-slate-50 hover:bg-white transition-colors">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-slate-50">All Priority</SelectItem>
                <SelectItem value="low" className="hover:bg-slate-50">Low</SelectItem>
                <SelectItem value="medium" className="hover:bg-slate-50">Medium</SelectItem>
                <SelectItem value="high" className="hover:bg-slate-50">High</SelectItem>
                <SelectItem value="urgent" className="hover:bg-slate-50">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange(prev => ({ ...prev, category: value as any }))}
            >
              <SelectTrigger className="w-[140px] border-slate-300 focus:border-primary bg-slate-50 hover:bg-white transition-colors">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-slate-50">All Categories</SelectItem>
                <SelectItem value="maintenance" className="hover:bg-slate-50">Maintenance</SelectItem>
                <SelectItem value="repair" className="hover:bg-slate-50">Repair</SelectItem>
                <SelectItem value="inspection" className="hover:bg-slate-50">Inspection</SelectItem>
                <SelectItem value="installation" className="hover:bg-slate-50">Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
