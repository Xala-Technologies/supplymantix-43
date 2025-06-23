
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    label: 'Text Input', 
    icon: Type, 
    description: 'Single line text input',
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    value: 'number', 
    label: 'Number Input', 
    icon: Hash, 
    description: 'Numeric values only',
    color: 'bg-green-100 text-green-700'
  },
  { 
    value: 'date', 
    label: 'Date Input', 
    icon: Calendar, 
    description: 'Date picker',
    color: 'bg-purple-100 text-purple-700'
  },
  { 
    value: 'checkbox', 
    label: 'Checkbox', 
    icon: CheckSquare, 
    description: 'Yes/no or true/false',
    color: 'bg-orange-100 text-orange-700'
  },
  { 
    value: 'select', 
    label: 'Dropdown', 
    icon: ChevronDown, 
    description: 'Single choice from options',
    color: 'bg-pink-100 text-pink-700'
  },
  { 
    value: 'multiselect', 
    label: 'Multi-Select', 
    icon: List, 
    description: 'Multiple choices from options',
    color: 'bg-indigo-100 text-indigo-700'
  },
  { 
    value: 'file', 
    label: 'File Upload', 
    icon: Upload, 
    description: 'Upload documents or images',
    color: 'bg-red-100 text-red-700'
  },
  { 
    value: 'section', 
    label: 'Section Header', 
    icon: Heading, 
    description: 'Organize fields into sections',
    color: 'bg-gray-100 text-gray-700'
  }
];

export const FieldTypeSelector: React.FC<FieldTypeSelectorProps> = ({ value, onChange }) => {
  const selectedType = FIELD_TYPES.find(type => type.value === value);

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12">
          <SelectValue>
            {selectedType && (
              <div className="flex items-center gap-3">
                <selectedType.icon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedType.label}</span>
                  <span className="text-xs text-gray-500">{selectedType.description}</span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {FIELD_TYPES.map(type => (
            <SelectItem key={type.value} value={type.value} className="p-3">
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg ${type.color}`}>
                  <type.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
