
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Type, Hash, DollarSign, CheckSquare, CircleDot, List, Search, Calendar, FileText, Upload } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface AddItemSidebarProps {
  onAddField: (type?: ProcedureField['field_type']) => void;
  onAddHeading: () => void;
  onAddSection: () => void;
}

const FIELD_TYPES = [
  { type: 'text', label: 'Text', icon: Type, color: 'text-green-600', bgColor: 'bg-green-100' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { type: 'number', label: 'Number', icon: Hash, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { type: 'amount', label: 'Amount', icon: DollarSign, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { type: 'date', label: 'Date', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { type: 'select', label: 'Select', icon: CircleDot, color: 'text-red-600', bgColor: 'bg-red-100' },
  { type: 'multiselect', label: 'Multi-Select', icon: List, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { type: 'file', label: 'File Upload', icon: Upload, color: 'text-gray-600', bgColor: 'bg-gray-100' },
] as const;

export const AddItemSidebar: React.FC<AddItemSidebarProps> = ({
  onAddField,
  onAddHeading,
  onAddSection
}) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <h3 className="text-lg font-medium text-gray-900 text-center">Add Items</h3>
        
        {/* Field Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Field Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {FIELD_TYPES.map(({ type, label, icon: Icon, color, bgColor }) => (
              <Button
                key={type}
                onClick={() => onAddField(type as ProcedureField['field_type'])}
                variant="ghost"
                className="h-20 flex flex-col items-center justify-center p-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center ${bgColor} mb-1`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Sections</h4>
          
          {/* Heading Button */}
          <Button
            onClick={onAddHeading}
            variant="ghost"
            className="w-full h-16 flex items-center justify-start gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
              <Type className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Heading</span>
          </Button>

          {/* Section Button */}
          <Button
            onClick={onAddSection}
            variant="ghost"
            className="w-full h-16 flex items-center justify-start gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <div className="w-6 h-1 bg-gray-600 rounded"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Section Divider</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
