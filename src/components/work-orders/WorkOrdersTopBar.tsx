
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, SlidersHorizontal, Zap } from 'lucide-react';
import { WorkOrderFilters } from '@/types/workOrder';

interface WorkOrdersTopBarProps {
  filters: WorkOrderFilters;
  onFiltersChange: (filters: WorkOrderFilters) => void;
  onCreateWorkOrder: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export const WorkOrdersTopBar = ({
  filters,
  onFiltersChange,
  onCreateWorkOrder,
  totalCount = 0,
  filteredCount = 0
}: WorkOrdersTopBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'all').length;

  const handleFilterChange = (key: keyof WorkOrderFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      priority: 'all',
      assignedTo: 'all',
      category: 'all'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Work Orders
            </h1>
            <p className="text-gray-600 text-lg">
              Streamline your maintenance operations
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative gap-2 hover:bg-gray-50 border-gray-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <Button 
            onClick={onCreateWorkOrder} 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search work orders..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalCount}</span> orders
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Assigned To</label>
              <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="me">Assigned to Me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="flex justify-end mt-6">
              <Button variant="outline" size="sm" onClick={clearFilters} className="hover:bg-gray-50">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
