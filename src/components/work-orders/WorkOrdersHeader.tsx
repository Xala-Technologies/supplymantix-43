
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
import { Search, User, Calendar, MapPin, Tag, AlertTriangle, CircleCheck, Filter, Settings, ChevronDown, X } from "lucide-react";
import { NewWorkOrderDialog } from "./NewWorkOrderDialog";
import { useState } from "react";

interface FilterState {
  search: string;
  assignedTo: string[];
  status: string[];
  priority: string[];
  category: string[];
  location: string[];
  dueDateRange: string;
}

export const WorkOrdersHeader = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    assignedTo: [],
    status: [],
    priority: [],
    category: [],
    location: [],
    dueDateRange: "all",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Sample data based on the work orders structure
  const statusOptions = ["Open", "In Progress", "On Hold", "Done"];
  const priorityOptions = ["High", "Medium", "Low"];
  const categoryOptions = ["Equipment", "Safety", "Maintenance", "Inspection", "PM"];
  const locationOptions = ["Production Line 3", "Production Line 2", "Utility Room", "Building A", "Entire Facility"];
  const assigneeOptions = ["Zach Brown", "Maintenance Team 1", "Maintenance Team 2", "Operations", "Safety Team"];
  const dueDateOptions = [
    { value: "all", label: "All Time" },
    { value: "overdue", label: "Overdue" },
    { value: "today", label: "Due Today" },
    { value: "week", label: "Due This Week" },
    { value: "month", label: "Due This Month" },
  ];

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMultiSelectFilter = (filterType: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      if (checked) {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      assignedTo: [],
      status: [],
      priority: [],
      category: [],
      location: [],
      dueDateRange: "all",
    });
    setActiveFilters([]);
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (value) {
      setFilters(prev => ({
        ...prev,
        [filterType]: (prev[filterType as keyof FilterState] as string[]).filter(v => v !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: filterType === 'dueDateRange' ? 'all' : []
      }));
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.assignedTo.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.dueDateRange !== 'all') count++;
    return count;
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="p-4 lg:p-6">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Work Orders</h1>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">📋</Badge>
              <Badge variant="outline" className="text-xs">📊</Badge>
              <Badge variant="outline" className="text-xs">📅</Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search Work Orders" 
                className="pl-10 w-full sm:w-64"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <NewWorkOrderDialog />
          </div>
        </div>
        
        {/* Enhanced Filter row */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm">
            {/* Assigned To Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Assigned To</span>
                  {filters.assignedTo.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.assignedTo.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Assigned To</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {assigneeOptions.map((assignee) => (
                  <DropdownMenuCheckboxItem
                    key={assignee}
                    checked={filters.assignedTo.includes(assignee)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('assignedTo', assignee, checked)}
                  >
                    {assignee}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Due Date Filter */}
            <Select value={filters.dueDateRange} onValueChange={(value) => handleFilterChange('dueDateRange', value)}>
              <SelectTrigger className="w-auto h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-0 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Due Date</span>
                {filters.dueDateRange !== 'all' && (
                  <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">1</Badge>
                )}
              </SelectTrigger>
              <SelectContent>
                {dueDateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Location</span>
                  {filters.location.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.location.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {locationOptions.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={filters.location.includes(location)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('location', location, checked)}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <Tag className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Category</span>
                  {filters.category.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.category.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categoryOptions.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={filters.category.includes(category)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('category', category, checked)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Priority</span>
                  {filters.priority.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.priority.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {priorityOptions.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={filters.priority.includes(priority)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('priority', priority, checked)}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <CircleCheck className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Status</span>
                  {filters.status.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {filters.status.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => handleMultiSelectFilter('status', status, checked)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Filter controls */}
            <div className="flex items-center space-x-4 ml-auto">
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
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Save Filter</span>
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.assignedTo.length > 0 || filters.status.length > 0 || filters.priority.length > 0 || 
            filters.category.length > 0 || filters.location.length > 0 || filters.dueDateRange !== 'all') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              
              {filters.assignedTo.map((assignee) => (
                <Badge key={assignee} variant="secondary" className="text-xs">
                  Assigned: {assignee}
                  <button 
                    onClick={() => removeFilter('assignedTo', assignee)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.status.map((status) => (
                <Badge key={status} variant="secondary" className="text-xs">
                  Status: {status}
                  <button 
                    onClick={() => removeFilter('status', status)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.priority.map((priority) => (
                <Badge key={priority} variant="secondary" className="text-xs">
                  Priority: {priority}
                  <button 
                    onClick={() => removeFilter('priority', priority)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.category.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  Category: {category}
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
                  Location: {location}
                  <button 
                    onClick={() => removeFilter('location', location)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {filters.dueDateRange !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Due: {dueDateOptions.find(opt => opt.value === filters.dueDateRange)?.label}
                  <button 
                    onClick={() => removeFilter('dueDateRange')}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
