
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Type, 
  Hash, 
  DollarSign, 
  CheckSquare, 
  CircleDot, 
  List,
  Calendar,
  Upload,
  FileText,
  Minus
} from "lucide-react";

interface FieldTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FIELD_TYPES = [
  { 
    value: 'text', 
    label: 'Text Field', 
    icon: Type, 
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  { 
    value: 'checkbox', 
    label: 'Checkbox', 
    icon: CheckSquare, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    value: 'number', 
    label: 'Number Field', 
    icon: Hash, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  { 
    value: 'amount', 
    label: 'Amount ($)', 
    icon: DollarSign, 
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  { 
    value: 'date', 
    label: 'Date Picker', 
    icon: Calendar, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  { 
    value: 'select', 
    label: 'Single Select', 
    icon: CircleDot, 
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  { 
    value: 'multiselect', 
    label: 'Multi Select', 
    icon: List, 
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  { 
    value: 'file', 
    label: 'File Upload', 
    icon: Upload, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  { 
    value: 'section', 
    label: 'Section Header', 
    icon: FileText, 
    color: 'text-teal-600',
    bgColor: 'bg-teal-100'
  },
  { 
    value: 'divider', 
    label: 'Divider', 
    icon: Minus, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
];

export const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ value, onChange }) => {
  const selectedType = FIELD_TYPES.find(type => type.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 bg-white border border-gray-200">
        <SelectValue>
          {selectedType && (
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedType.bgColor}`}>
                <selectedType.icon className={`h-4 w-4 ${selectedType.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{selectedType.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
        {FIELD_TYPES.map(type => (
          <SelectItem 
            key={type.value} 
            value={type.value} 
            className="py-3 px-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${type.bgColor}`}>
                <type.icon className={`h-4 w-4 ${type.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{type.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
