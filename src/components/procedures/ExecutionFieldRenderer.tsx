
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
    'text': 'bg-blue-50 border-blue-200',
    'number': 'bg-green-50 border-green-200',
    'date': 'bg-purple-50 border-purple-200',
    'checkbox': 'bg-orange-50 border-orange-200',
    'select': 'bg-pink-50 border-pink-200',
    'multiselect': 'bg-indigo-50 border-indigo-200',
    'file': 'bg-red-50 border-red-200',
    'section': 'bg-gray-50 border-gray-200'
  };
  return colors[fieldType] || 'bg-gray-50 border-gray-200';
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
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heading className="h-6 w-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">{field.label}</h3>
          </div>
          <p className="text-gray-600">Section header - click Next to continue</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getFieldTypeColor(field.field_type)} transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Field Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <FieldIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={fieldId} className="text-lg font-medium text-gray-900">
                  {field.label}
                </Label>
                {field.is_required && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getFieldDescription(field.field_type)}
              </p>
            </div>
          </div>

          {/* Field Input */}
          <div className="bg-white rounded-lg p-4 border">
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

const getFieldDescription = (fieldType: string): string => {
  const descriptions: Record<string, string> = {
    'text': 'Enter text information',
    'number': 'Enter a numeric value',
    'date': 'Select a date',
    'checkbox': 'Check if applicable',
    'select': 'Choose one option',
    'multiselect': 'Choose multiple options',
    'file': 'Upload a file or document'
  };
  return descriptions[fieldType] || '';
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
          className="text-lg h-12"
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
          className="text-lg h-12"
        />
      );

    case 'date':
      return (
        <Input
          id={fieldId}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="text-lg h-12"
        />
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-3 p-2">
          <Checkbox
            id={fieldId}
            checked={value === true}
            onCheckedChange={(checked) => onChange(checked)}
            className="h-5 w-5"
          />
          <Label htmlFor={fieldId} className="text-lg cursor-pointer">
            {field.label}
          </Label>
        </div>
      );

    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.choices?.map((choice: string) => (
              <SelectItem key={choice} value={choice} className="text-lg">
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multiselect':
      return (
        <div className="space-y-3">
          {field.options?.choices?.map((choice: string) => (
            <div key={choice} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
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
              <Label htmlFor={`${fieldId}_${choice}`} className="cursor-pointer">
                {choice}
              </Label>
            </div>
          ))}
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
                onChange({
                  name: file.name,
                  size: file.size,
                  type: file.type
                });
              }
            }}
            className="h-12 text-lg"
          />
          {value && (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm font-medium">{value.name}</p>
              <p className="text-xs text-gray-600">
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
          rows={4}
          className="resize-none text-lg"
        />
      );
  }
};
