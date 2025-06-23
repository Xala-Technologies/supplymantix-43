
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Filter, Plus, ChevronDown, BarChart3, TrendingUp } from "lucide-react";
import { WorkOrderFilters } from "@/types/workOrder";
import { useState } from "react";

interface WorkOrdersTopHeaderProps {
  workOrdersCount: number;
  totalCount: number;
  filters: WorkOrderFilters;
  onFiltersChange: (filters: WorkOrderFilters) => void;
  onCreateWorkOrder?: () => void;
}

export const WorkOrdersTopHeader = ({ 
  workOrdersCount,
  totalCount,
  filters,
  onFiltersChange,
  onCreateWorkOrder 
}: WorkOrdersTopHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const setFilters = (newFilters: Partial<WorkOrderFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-200">
      <div className="p-6">
        {/* Header Title and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Work Orders</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>{workOrdersCount} of {totalCount} orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Manage & track maintenance</span>
                </div>
              </div>
            </div>
          </div>
          
          {onCreateWorkOrder && (
            <Button 
              onClick={onCreateWorkOrder} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 gap-2 px-6 h-11"
            >
              <Plus className="w-4 h-4" />
              Create New Order
            </Button>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search work orders..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10 h-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Select value={filters.status} onValueChange={(value) => setFilters({ status: value })}>
              <SelectTrigger className="w-32 h-10 bg-white border-gray-200 shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({ priority: value })}>
              <SelectTrigger className="w-32 h-10 bg-white border-gray-200 shadow-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 bg-white border-gray-200 hover:bg-gray-50 shadow-sm gap-2"
            >
              <Filter className="w-4 h-4" />
              More Filters
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </Button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ category: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Assigned To</label>
                <Select value={filters.assignedTo} onValueChange={(value) => setFilters({ assignedTo: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="me">Assigned to Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilters({ search: '', status: 'all', priority: 'all', category: 'all', assignedTo: 'all' })}
                  className="h-9"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
