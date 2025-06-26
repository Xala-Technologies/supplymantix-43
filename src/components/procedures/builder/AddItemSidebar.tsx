
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Type, Hash, CheckSquare, Circle, List, Calendar, Upload, FileText } from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

interface AddItemSidebarProps {
  onAddField: (type?: ProcedureField['field_type']) => void;
  onAddHeading: () => void;
  onAddSection: () => void;
}

const FIELD_TYPES = [
  {
    type: 'text' as const,
    label: 'Text Field',
    icon: Type,
    description: 'Single line text input'
  },
  {
    type: 'number' as const,
    label: 'Number',
    icon: Hash,
    description: 'Numeric input field'
  },
  {
    type: 'checkbox' as const,
    label: 'Checkbox',
    icon: CheckSquare,
    description: 'Yes/No checkbox'
  },
  {
    type: 'select' as const,
    label: 'Multiple Choice',
    icon: Circle,
    description: 'Select one option'
  },
  {
    type: 'multiselect' as const,
    label: 'Checklist',
    icon: List,
    description: 'Select multiple options'
  },
  {
    type: 'date' as const,
    label: 'Date',
    icon: Calendar,
    description: 'Date picker'
  },
  {
    type: 'file' as const,
    label: 'File Upload',
    icon: Upload,
    description: 'Upload files or images'
  }
];

export const AddItemSidebar: React.FC<AddItemSidebarProps> = ({
  onAddField,
  onAddHeading,
  onAddSection
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Item</h3>
          
          {/* Field Types */}
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Fields</h4>
            {FIELD_TYPES.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <Button
                  key={fieldType.type}
                  onClick={() => onAddField(fieldType.type)}
                  className="w-full justify-start gap-3 h-auto p-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  variant="outline"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{fieldType.label}</div>
                    <div className="text-xs text-gray-500">{fieldType.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Structure Elements */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Structure</h4>
            
            {/* Heading Button */}
            <Button
              onClick={onAddHeading}
              className="w-full justify-start gap-3 h-auto p-4 bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-700 hover:text-blue-700"
              variant="outline"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Type className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Heading</div>
                <div className="text-xs text-gray-500">Section title</div>
              </div>
            </Button>

            {/* Section Button */}
            <Button
              onClick={onAddSection}
              className="w-full justify-start gap-3 h-auto p-4 bg-white border border-gray-200 hover:bg-purple-50 hover:border-purple-200 text-gray-700 hover:text-purple-700"
              variant="outline"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-3 bg-purple-600 rounded"></div>
              </div>
              <div className="text-left">
                <div className="font-medium">Section</div>
                <div className="text-xs text-gray-500">Group related fields</div>
              </div>
            </Button>

            {/* Procedure Button */}
            <Button
              className="w-full justify-start gap-3 h-auto p-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-400"
              variant="outline"
              disabled
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Procedure</div>
                <div className="text-xs text-gray-400">Coming soon</div>
              </div>
            </Button>
          </div>

          {/* Quick Add */}
          <div className="pt-6 border-t">
            <Button
              onClick={() => onAddField('text')}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Quick Add Text Field
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
