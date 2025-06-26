
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
    <div className="w-64 bg-white border-l border-gray-200 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">New Item</h3>
          
          <div className="space-y-3">
            {/* Field Button */}
            <Button
              onClick={() => onAddField()}
              className="w-full justify-start gap-3 h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-medium">Field</span>
            </Button>

            {/* Heading Button */}
            <Button
              onClick={onAddHeading}
              className="w-full justify-start gap-3 h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Type className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">Heading</span>
            </Button>

            {/* Section Button */}
            <Button
              onClick={onAddSection}
              className="w-full justify-start gap-3 h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-2 bg-blue-600 rounded"></div>
              </div>
              <span className="font-medium">Section</span>
            </Button>

            {/* Procedure Button */}
            <Button
              className="w-full justify-start gap-3 h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
              variant="outline"
              disabled
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">Procedure</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
