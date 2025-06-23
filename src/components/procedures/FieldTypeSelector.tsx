
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Type, 
  Hash, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  List, 
  Upload, 
  Heading 
} from "lucide-react";

interface FieldTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FIELD_TYPES = [
  { 
    value: 'text', 
    label: 'Text', 
    icon: Type, 
    description: 'Single line text',
    color: 'text-blue-600'
  },
  { 
    value: 'number', 
    label: 'Number', 
    icon: Hash, 
    description: 'Numeric values',
    color: 'text-green-600'
  },
  { 
    value: 'date', 
    label: 'Date', 
    icon: Calendar, 
    description: 'Date picker',
    color: 'text-purple-600'
  },
  { 
    value: 'checkbox', 
    label: 'Checkbox', 
    icon: CheckSquare, 
    description: 'Yes/no',
    color: 'text-orange-600'
  },
  { 
    value: 'select', 
    label: 'Dropdown', 
    icon: ChevronDown, 
    description: 'Single choice',
    color: 'text-pink-600'
  },
  { 
    value: 'multiselect', 
    label: 'Multi-Select', 
    icon: List, 
    description: 'Multiple choices',
    color: 'text-indigo-600'
  },
  { 
    value: 'file', 
    label: 'File Upload', 
    icon: Upload, 
    description: 'Upload files',
    color: 'text-red-600'
  },
  { 
    value: 'section', 
    label: 'Section', 
    icon: Heading, 
    description: 'Organize fields',
    color: 'text-gray-600'
  }
];

export const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ value, onChange }) => {
  const selectedType = FIELD_TYPES.find(type => type.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8">
        <SelectValue>
          {selectedType && (
            <div className="flex items-center gap-2">
              <selectedType.icon className="h-3 w-3" />
              <span className="text-sm font-medium">{selectedType.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {FIELD_TYPES.map(type => (
          <SelectItem key={type.value} value={type.value} className="py-2">
            <div className="flex items-center gap-2 w-full">
              <type.icon className={`h-4 w-4 ${type.color}`} />
              <div className="flex-1">
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
