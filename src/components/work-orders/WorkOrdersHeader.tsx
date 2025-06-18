
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, SortAsc, FileTemplate } from 'lucide-react';
import { WorkOrderFilters } from '@/types/workOrder';
import { WorkOrderTemplatesDialog } from './WorkOrderTemplatesDialog';

interface WorkOrdersHeaderProps {
  filters: WorkOrderFilters;
  onFiltersChange: (filters: WorkOrderFilters) => void;
  onCreateWorkOrder: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export const WorkOrdersHeader = ({
  filters,
  onFiltersChange,
  onCreateWorkOrder,
  totalCount = 0,
  filteredCount = 0
}: WorkOrdersHeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

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
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredCount} of {totalCount} work orders
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsTemplatesOpen(true)}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <FileTemplate className="h-4 w-4 mr-2" />
            Templates
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <Button onClick={onCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search work orders..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange('assignedTo', value)}>
                <SelectTrigger>
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
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      <WorkOrderTemplatesDialog 
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />
    </div>
  );
};
