
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

const renderFieldInput = (field: ProcedureField, value: any, onChange: (value: any) => void, fieldId: string) => {
  console.log(`Rendering field ${field.field_type} with value:`, value);
  
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
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="text-sm w-full"
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
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="text-sm w-full"
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
          className="text-sm w-full"
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-3 p-3">
          <Checkbox
            id={fieldId}
            checked={Boolean(value)}
            onCheckedChange={(checked) => {
              console.log(`Checkbox field ${fieldId} changed to:`, checked);
              onChange(checked === true);
            }}
            className="h-5 w-5"
          />
          <Label htmlFor={fieldId} className="cursor-pointer text-sm font-medium">
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
          <SelectTrigger className="text-sm w-full">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {choices.length === 0 ? (
              <SelectItem value="" disabled>No options available</SelectItem>
            ) : (
              choices.map((choice: string, index: number) => (
                <SelectItem key={`${choice}-${index}`} value={choice} className="text-sm">
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
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {multiselectChoices.length === 0 ? (
            <div className="text-sm text-gray-500 p-3">No options available</div>
          ) : (
            multiselectChoices.map((choice: string, index: number) => (
              <div key={`${choice}-${index}`} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
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
                  className="h-4 w-4"
                />
                <Label htmlFor={`${fieldId}_${choice}_${index}`} className="cursor-pointer text-sm">
                  {choice}
                </Label>
              </div>
            ))
          )}
        </div>
      );

    case 'file':
      return (
        <div className="space-y-3">
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
            className="text-sm w-full"
            accept="*/*"
          />
          {value && typeof value === 'object' && value.name && (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="font-medium text-sm text-gray-900">{value.name}</p>
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
          placeholder={`Enter ${field.label.toLowerCase()}`}
          rows={3}
          className="resize-none text-sm w-full"
        />
      );
  }
};

export const ExecutionFieldRenderer: React.FC<ExecutionFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  fieldId
}) => {
  const FieldIcon = getFieldIcon(field.field_type);

  if (field.field_type === 'section') {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-dashed border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heading className="h-5 w-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">{field.label}</h3>
          </div>
          <p className="text-sm text-gray-600">Section header - click Next to continue</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 ${getFieldTypeColor(field.field_type)} shadow-sm`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Field Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <FieldIcon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={fieldId} className="text-base font-medium text-gray-900">
                  {field.label}
                </Label>
                {field.is_required && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Field Input */}
          <div className="bg-white rounded-lg border p-4">
            {renderFieldInput(field, value, onChange, fieldId)}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
