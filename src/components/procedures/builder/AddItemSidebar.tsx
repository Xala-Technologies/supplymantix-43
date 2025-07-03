
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Type, FileText } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface AddItemSidebarProps {
  onAddField: (type?: ProcedureField['field_type']) => void;
  onAddHeading: () => void;
  onAddSection: () => void;
}

export const AddItemSidebar: React.FC<AddItemSidebarProps> = ({
  onAddField,
  onAddHeading,
  onAddSection
}) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <h3 className="text-lg font-medium text-gray-400 text-center mb-8">New Item</h3>
        
        {/* Field Button */}
        <div className="flex flex-col items-center">
          <Button
            onClick={() => onAddField('text')}
            className="w-16 h-16 rounded-full bg-green-100 hover:bg-green-200 border-2 border-green-300 mb-2"
            variant="ghost"
          >
            <Plus className="h-8 w-8 text-green-600" />
          </Button>
          <span className="text-sm font-medium text-gray-700">Field</span>
        </div>

        {/* Heading Button */}
        <div className="flex flex-col items-center">
          <Button
            onClick={onAddHeading}
            className="w-16 h-16 rounded-full bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300 mb-2"
            variant="ghost"
          >
            <Type className="h-8 w-8 text-indigo-600" />
          </Button>
          <span className="text-sm font-medium text-gray-700">Heading</span>
        </div>

        {/* Section Button */}
        <div className="flex flex-col items-center">
          <Button
            onClick={onAddSection}
            className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 mb-2"
            variant="ghost"
          >
            <div className="w-8 h-6 bg-slate-600 rounded"></div>
          </Button>
          <span className="text-sm font-medium text-gray-700">Section</span>
        </div>

        {/* Procedure Button (Disabled) */}
        <div className="flex flex-col items-center">
          <Button
            className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 mb-2 cursor-not-allowed"
            variant="ghost"
            disabled
          >
            <FileText className="h-8 w-8 text-gray-400" />
          </Button>
          <span className="text-sm font-medium text-gray-400">Procedure</span>
        </div>
      </div>
    </div>
  );
};
