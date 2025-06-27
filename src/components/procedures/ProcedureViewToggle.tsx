
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface ProcedureViewToggleProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

export const ProcedureViewToggle: React.FC<ProcedureViewToggleProps> = ({
  view,
  onViewChange
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      <Button
        size="sm"
        variant={view === 'card' ? 'default' : 'ghost'}
        onClick={() => onViewChange('card')}
        className={`px-3 py-1.5 text-xs ${
          view === 'card' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
        Cards
      </Button>
      <Button
        size="sm"
        variant={view === 'list' ? 'default' : 'ghost'}
        onClick={() => onViewChange('list')}
        className={`px-3 py-1.5 text-xs ${
          view === 'list' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="h-3.5 w-3.5 mr-1.5" />
        List
      </Button>
    </div>
  );
};
