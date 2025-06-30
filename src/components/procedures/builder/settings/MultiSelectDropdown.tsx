
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
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">{label}</label>
        <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">{label}</label>
        <div className="w-full p-4 border border-red-200 rounded-lg bg-red-50">
          <span className="text-sm text-red-600">Error loading {label.toLowerCase()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      
      {/* Selected items display */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNames.map((name, index) => {
            const item = items.find(item => item.name === name);
            if (!item) return null;
            
            return (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm font-medium">{name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
            className="w-full justify-between text-left font-normal h-11 px-4 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            type="button"
          >
            <span className={selectedNames.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
              {selectedNames.length > 0 
                ? `${selectedNames.length} selected`
                : placeholder
              }
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full p-0 bg-white border border-gray-200 shadow-lg rounded-lg z-50" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">•</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">No {label.toLowerCase()} available</p>
              </div>
            ) : (
              <div className="p-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors group"
                    onClick={() => onToggle(item.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <span className="text-sm text-gray-900 font-medium flex-1 group-hover:text-gray-700">
                      {item.name}
                    </span>
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
