
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Type, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProcedureField } from '@/lib/database/procedures-enhanced';

const FIELD_TYPES = [
  { 
    value: 'text', 
    label: 'Text Field', 
    icon: '✓T',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  { 
    value: 'checkbox', 
    label: 'Checkbox', 
    icon: '☑',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    value: 'number', 
    label: 'Number Field', 
    icon: '#',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  { 
    value: 'amount', 
    label: 'Amount ($)', 
    icon: '$',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  { 
    value: 'select', 
    label: 'Multiple Choice', 
    icon: '◉',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  { 
    value: 'multiselect', 
    label: 'Checklist', 
    icon: '☰',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  { 
    value: 'inspection', 
    label: 'Inspection Check', 
    icon: '🔍',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100'
  }
];

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
      <div className="space-y-6">
        {/* Header */}
        <h3 className="text-lg font-medium text-gray-900 text-center">Add Items</h3>
        
        {/* Field Types Dropdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Field Types</h4>
          <div className="grid grid-cols-1 gap-2">
            {FIELD_TYPES.map((fieldType) => (
              <Button
                key={fieldType.value}
                onClick={() => onAddField(fieldType.value as ProcedureField['field_type'])}
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${fieldType.bgColor}`}>
                    <span className={fieldType.color}>{fieldType.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-left flex-1">
                    {fieldType.label}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Structure</h4>
          
          {/* Heading Button */}
          <div className="space-y-2">
            <Button
              onClick={onAddHeading}
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Type className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Heading</span>
              </div>
            </Button>

            {/* Section Button */}
            <Button
              onClick={onAddSection}
              variant="ghost"
              className="w-full justify-start p-3 h-auto hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-4 h-3 bg-blue-600 rounded"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Section</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
