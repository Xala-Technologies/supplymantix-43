import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X, Filter, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useReporting, ReportFilter } from '@/contexts/ReportingContext';

export const FilterBar = () => {
  const { dateRange, setDateRange, filters, updateFilter, removeFilter, addFilter } = useReporting();
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilterType, setNewFilterType] = useState('');

  const availableFilterTypes = [
    { label: 'Status', value: 'status', type: 'multiselect' },
    { label: 'Category', value: 'category', type: 'multiselect' },
    { label: 'Asset Type', value: 'asset_type', type: 'multiselect' },
    { label: 'Team', value: 'team', type: 'multiselect' },
  ];

  const handleAddFilter = () => {
    const filterType = availableFilterTypes.find(f => f.value === newFilterType);
    if (filterType) {
      const newFilter: ReportFilter = {
        id: `${filterType.value}_${Date.now()}`,
        label: filterType.label,
        type: filterType.type as any,
        value: [],
        options: [], // These would be populated from API
      };
      addFilter(newFilter);
      setNewFilterType('');
      setShowAddFilter(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Filters
        </Button>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Date Range:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-2">
              {filter.label}: {Array.isArray(filter.value) ? filter.value.length : filter.value || 'Any'}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        ))}

        {/* Add Filter */}
        {showAddFilter ? (
          <div className="flex items-center gap-2">
            <Select value={newFilterType} onValueChange={setNewFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {availableFilterTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAddFilter} disabled={!newFilterType}>
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAddFilter(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAddFilter(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        )}
      </div>
    </div>
  );
};