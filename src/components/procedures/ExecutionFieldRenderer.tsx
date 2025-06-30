
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Type, 
  Hash, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  List, 
  Upload, 
  Heading,
  AlertCircle
} from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";

interface ExecutionFieldRendererProps {
  field: ProcedureField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldId: string;
}

const getFieldIcon = (fieldType: string) => {
  const icons: Record<string, any> = {
    'text': Type,
    'number': Hash,
    'date': Calendar,
    'checkbox': CheckSquare,
    'select': ChevronDown,
    'multiselect': List,
    'file': Upload,
    'section': Heading
  };
  return icons[fieldType] || Type;
};

const getFieldTypeColor = (fieldType: string) => {
  const colors: Record<string, string> = {
    'text': 'border-l-blue-400',
    'number': 'border-l-green-400',
    'date': 'border-l-purple-400',
    'checkbox': 'border-l-orange-400',
    'select': 'border-l-pink-400',
    'multiselect': 'border-l-indigo-400',
    'file': 'border-l-red-400',
    'section': 'border-l-gray-400'
  };
  return colors[fieldType] || 'border-l-gray-400';
};

export const ExecutionFieldRenderer: React.FC<ExecutionFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  fieldId
}) => {
  const FieldIcon = getFieldIcon(field.field_type);

  console.log(`Rendering field ${field.field_type} with value:`, value);

  // Section fields with enhanced design
  if (field.field_type === 'section') {
    return (
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
            <Heading className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{field.label}</h3>
        </div>
        <p className="text-gray-600">Section header - click Next to continue</p>
      </div>
    );
  }

  const renderInput = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            value={value || ''}
            onChange={(e) => {
              console.log(`Text field ${fieldId} changed to:`, e.target.value);
              onChange(e.target.value);
            }}
            placeholder=""
            className="text-base h-12 border-2 focus:border-blue-500 transition-colors"
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={value || ''}
            onChange={(e) => {
              const numValue = e.target.value;
              console.log(`Number field ${fieldId} changed to:`, numValue);
              onChange(numValue);
            }}
            placeholder=""
            className="text-base h-12 border-2 focus:border-blue-500 transition-colors"
            step="any"
          />
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => {
              console.log(`Date field ${fieldId} changed to:`, e.target.value);
              onChange(e.target.value);
            }}
            className="text-base h-12 border-2 focus:border-blue-500 transition-colors"
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border-2 hover:bg-gray-100 transition-colors">
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => {
                console.log(`Checkbox field ${fieldId} changed to:`, checked);
                onChange(checked === true);
              }}
              className="h-6 w-6"
            />
            <Label htmlFor={fieldId} className="cursor-pointer text-base font-medium">
              {field.label}
            </Label>
          </div>
        );

      case 'select':
        const choices = field.options?.choices || [];
        return (
          <Select 
            value={value || ''} 
            onValueChange={(selectedValue) => {
              console.log(`Select field ${fieldId} changed to:`, selectedValue);
              onChange(selectedValue);
            }}
          >
            <SelectTrigger className="text-base h-12 border-2 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 shadow-xl z-50">
              {choices.length === 0 ? (
                <SelectItem value="" disabled>No options available</SelectItem>
              ) : (
                choices.map((choice: string, index: number) => (
                  <SelectItem key={`${choice}-${index}`} value={choice} className="text-base">
                    {choice}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const multiselectChoices = field.options?.choices || [];
        const selectedValues = Array.isArray(value) ? value : [];
        
        return (
          <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-1 bg-white">
            {multiselectChoices.length === 0 ? (
              <div className="text-xs text-gray-500 p-2">No options available</div>
            ) : (
              multiselectChoices.map((choice: string, index: number) => (
                <div key={`${choice}-${index}`} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={`${fieldId}_${choice}_${index}`}
                    checked={selectedValues.includes(choice)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? [...value] : [];
                      let newValues;
                      if (checked) {
                        newValues = [...currentValues, choice];
                      } else {
                        newValues = currentValues.filter((v: string) => v !== choice);
                      }
                      console.log(`Multiselect field ${fieldId} changed to:`, newValues);
                      onChange(newValues);
                    }}
                    className="h-3 w-3"
                  />
                  <Label htmlFor={`${fieldId}_${choice}_${index}`} className="cursor-pointer text-xs">
                    {choice}
                  </Label>
                </div>
              ))
            )}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              id={fieldId}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                  };
                  console.log(`File field ${fieldId} changed to:`, fileData);
                  onChange(fileData);
                } else {
                  onChange(null);
                }
              }}
              className="text-xs w-full h-7"
              accept="*/*"
            />
            {value && typeof value === 'object' && value.name && (
              <div className="p-2 bg-gray-50 rounded border">
                <p className="font-medium text-xs text-gray-900">{value.name}</p>
                <p className="text-gray-600 text-xs">
                  {value.size ? `${(value.size / 1024).toFixed(1)} KB` : 'Unknown size'} 
                  {value.type && ` • ${value.type}`}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <Textarea
            id={fieldId}
            value={value || ''}
            onChange={(e) => {
              console.log(`Textarea field ${fieldId} changed to:`, e.target.value);
              onChange(e.target.value);
            }}
            placeholder=""
            rows={4}
            className="resize-none text-base border-2 focus:border-blue-500 transition-colors"
          />
        );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden">
        {/* Modern Field Header */}
        <div className={`p-4 bg-gradient-to-r ${
          field.field_type === 'text' ? 'from-blue-50 to-indigo-50 border-b-blue-200' :
          field.field_type === 'number' ? 'from-green-50 to-emerald-50 border-b-green-200' :
          field.field_type === 'date' ? 'from-purple-50 to-violet-50 border-b-purple-200' :
          field.field_type === 'checkbox' ? 'from-orange-50 to-amber-50 border-b-orange-200' :
          field.field_type === 'select' ? 'from-pink-50 to-rose-50 border-b-pink-200' :
          field.field_type === 'multiselect' ? 'from-indigo-50 to-blue-50 border-b-indigo-200' :
          field.field_type === 'file' ? 'from-red-50 to-pink-50 border-b-red-200' :
          'from-gray-50 to-slate-50 border-b-gray-200'
        } border-b-2`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              field.field_type === 'text' ? 'bg-blue-100' :
              field.field_type === 'number' ? 'bg-green-100' :
              field.field_type === 'date' ? 'bg-purple-100' :
              field.field_type === 'checkbox' ? 'bg-orange-100' :
              field.field_type === 'select' ? 'bg-pink-100' :
              field.field_type === 'multiselect' ? 'bg-indigo-100' :
              field.field_type === 'file' ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              <FieldIcon className={`h-5 w-5 ${
                field.field_type === 'text' ? 'text-blue-600' :
                field.field_type === 'number' ? 'text-green-600' :
                field.field_type === 'date' ? 'text-purple-600' :
                field.field_type === 'checkbox' ? 'text-orange-600' :
                field.field_type === 'select' ? 'text-pink-600' :
                field.field_type === 'multiselect' ? 'text-indigo-600' :
                field.field_type === 'file' ? 'text-red-600' :
                'text-gray-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={fieldId} className="text-lg font-semibold text-gray-900">
                  {field.label}
                </Label>
                {field.is_required && (
                  <Badge variant="destructive" className="text-sm">
                    Required
                  </Badge>
                )}
              </div>
              {field.field_type !== 'checkbox' && (
                <Badge variant="outline" className="text-sm mt-1">
                  {field.field_type}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Field Input Area */}
        <div className="p-6">
          {renderInput()}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-6 flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
