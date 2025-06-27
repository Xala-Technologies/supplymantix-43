
import React from 'react';
import { LayoutGrid, List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  viewMode: 'card' | 'list' | 'calendar';
  onViewModeChange: (mode: 'card' | 'list' | 'calendar') => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className={`h-9 px-4 rounded-lg transition-all duration-200 ${
          viewMode === 'card' 
            ? 'bg-white shadow-sm border-0 text-gray-900' 
            : 'hover:bg-white/60 border-0 text-gray-600'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`h-9 px-4 rounded-lg transition-all duration-200 ${
          viewMode === 'list' 
            ? 'bg-white shadow-sm border-0 text-gray-900' 
            : 'hover:bg-white/60 border-0 text-gray-600'
        }`}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('calendar')}
        className={`h-9 px-4 rounded-lg transition-all duration-200 ${
          viewMode === 'calendar' 
            ? 'bg-white shadow-sm border-0 text-gray-900' 
            : 'hover:bg-white/60 border-0 text-gray-600'
        }`}
      >
        <Calendar className="w-4 h-4" />
      </Button>
    </div>
  );
};
