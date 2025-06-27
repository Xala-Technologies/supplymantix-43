
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from './ViewToggle';

interface WorkOrdersPageHeaderProps {
  viewMode: 'card' | 'list' | 'calendar';
  onViewModeChange: (mode: 'card' | 'list' | 'calendar') => void;
  onNewWorkOrder: () => void;
}

export const WorkOrdersPageHeader = ({ 
  viewMode, 
  onViewModeChange, 
  onNewWorkOrder 
}: WorkOrdersPageHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <Button 
        onClick={onNewWorkOrder} 
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2 px-6 py-2.5 rounded-xl font-medium"
      >
        <Plus className="w-4 h-4" />
        New Work Order
      </Button>
    </div>
  );
};
