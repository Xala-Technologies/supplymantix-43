
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  items: Array<{ id: string; name: string }>;
  selectedIds: string[];
  isLoading?: boolean;
  error?: any;
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedNames = getSelectedNames();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="p-3 border rounded-md bg-gray-50">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="p-3 border rounded-md bg-red-50 border-red-200">
          <span className="text-sm text-red-600">Error loading {label.toLowerCase()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected items display */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedNames.map((name, index) => {
            const item = items.find(item => item.name === name);
            if (!item) return null;
            
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {name}
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Dropdown trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
            type="button"
          >
            {selectedNames.length > 0 
              ? `${selectedNames.length} selected`
              : placeholder
            }
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
          <div className="max-h-60 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No {label.toLowerCase()} available
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => onToggle(item.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                    />
                    <span className="text-sm flex-1">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
