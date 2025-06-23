
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

  if (field.field_type === 'section') {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-dashed border-gray-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heading className="h-4 w-4 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">{field.label}</h3>
          </div>
          <p className="text-xs text-gray-600">Section header - click Next to continue</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 ${getFieldTypeColor(field.field_type)} transition-all duration-200`}>
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Compact Field Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-gray-100">
              <FieldIcon className="h-3 w-3 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={fieldId} className="text-sm font-medium text-gray-900">
                  {field.label}
                </Label>
                {field.is_required && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    Required
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Compact Field Input */}
          <div className="bg-white rounded border p-2">
            {renderFieldInput(field, value, onChange, fieldId)}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 p-1.5 rounded border border-red-200">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const renderFieldInput = (field: ProcedureField, value: any, onChange: (value: any) => void, fieldId: string) => {
  switch (field.field_type) {
    case 'text':
      return (
        <Input
          id={fieldId}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="h-8 text-sm"
        />
      );

    case 'number':
      return (
        <Input
          id={fieldId}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="h-8 text-sm"
        />
      );

    case 'date':
      return (
        <Input
          id={fieldId}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm"
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 p-0.5">
          <Checkbox
            id={fieldId}
            checked={value === true}
            onCheckedChange={(checked) => onChange(checked)}
            className="h-4 w-4"
          />
          <Label htmlFor={fieldId} className="cursor-pointer text-sm">
            {field.label}
          </Label>
        </div>
      );

    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.choices?.map((choice: string) => (
              <SelectItem key={choice} value={choice} className="text-sm">
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multiselect':
      return (
        <div className="space-y-1">
          {field.options?.choices?.map((choice: string) => (
            <div key={choice} className="flex items-center space-x-2 p-0.5 hover:bg-gray-50 rounded">
              <Checkbox
                id={`${fieldId}_${choice}`}
                checked={(value || []).includes(choice)}
                onCheckedChange={(checked) => {
                  const currentValues = value || [];
                  const newValues = checked
                    ? [...currentValues, choice]
                    : currentValues.filter((v: string) => v !== choice);
                  onChange(newValues);
                }}
                className="h-4 w-4"
              />
              <Label htmlFor={`${fieldId}_${choice}`} className="cursor-pointer text-xs">
                {choice}
              </Label>
            </div>
          ))}
        </div>
      );

    case 'file':
      return (
        <div className="space-y-1.5">
          <Input
            id={fieldId}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange({
                  name: file.name,
                  size: file.size,
                  type: file.type
                });
              }
            }}
            className="h-8 text-sm"
          />
          {value && (
            <div className="p-1.5 bg-gray-50 rounded border text-xs">
              <p className="font-medium">{value.name}</p>
              <p className="text-gray-600">
                {(value.size / 1024).toFixed(1)} KB • {value.type}
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          rows={2}
          className="resize-none text-sm"
        />
      );
  }
};
