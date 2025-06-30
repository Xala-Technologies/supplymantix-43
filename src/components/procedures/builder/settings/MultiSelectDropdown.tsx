
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronDown, X } from 'lucide-react';

interface MultiSelectItem {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  items: MultiSelectItem[];
  selectedIds: string[];
  isLoading: boolean;
  error: Error | null;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  getSelectedNames: () => string[];
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder,
  items,
  selectedIds,
  isLoading,
  error,
  onToggle,
  onRemove,
  getSelectedNames
}) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedNames = getSelectedNames();

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
      <div className="space-y-3">
        {/* Selected Items */}
        {selectedNames.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
            {selectedNames.map(name => (
              <Badge key={name} variant="secondary" className="flex items-center gap-1">
                {name}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-600" 
                  onClick={() => {
                    const item = items.find(i => i.name === name);
                    if (item) onRemove(item.id);
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
        
        <div className="relative">
          <div 
            className="flex items-center gap-2 h-11 px-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 flex-1">{placeholder}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-2">
                <Input
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              {isLoading ? (
                <div className="p-2 text-sm text-gray-500">Loading {label.toLowerCase()}...</div>
              ) : error ? (
                <div className="p-2 text-sm text-red-500">Error loading {label.toLowerCase()}</div>
              ) : filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => onToggle(item.id)}
                    />
                    <label className="text-sm cursor-pointer flex-1" onClick={() => onToggle(item.id)}>
                      {item.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">No {label.toLowerCase()} found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
