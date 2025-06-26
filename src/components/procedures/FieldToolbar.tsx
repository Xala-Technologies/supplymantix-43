import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Type, Hash, CheckSquare, Circle, List, Calendar, FileText } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";

interface FieldToolbarProps {
  onAddField: (type?: ProcedureField['field_type']) => void;
  onAddHeading: () => void;
}

const FIELD_TYPES = [
  { type: 'text' as const, label: 'Text Field', icon: Type, description: 'Single line text input' },
  { type: 'number' as const, label: 'Number Field', icon: Hash, description: 'Numeric input field' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: CheckSquare, description: 'Yes/No checkbox' },
  { type: 'select' as const, label: 'Multiple Choice', icon: Circle, description: 'Select one option' },
  { type: 'multiselect' as const, label: 'Checklist', icon: List, description: 'Select multiple options' },
  { type: 'date' as const, label: 'Date', icon: Calendar, description: 'Date picker' },
];

export const FieldToolbar: React.FC<FieldToolbarProps> = ({
  onAddField,
  onAddHeading
}) => {
  return (
    <div className="w-72 border-l bg-white overflow-y-auto">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Add New Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Field Types */}
            <div className="grid grid-cols-1 gap-2">
              {FIELD_TYPES.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <Button
                    key={fieldType.type}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddField(fieldType.type)}
                    className="justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-4 w-4 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{fieldType.label}</div>
                        <div className="text-xs text-gray-500">{fieldType.description}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Other Items */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddHeading}
                className="w-full justify-start h-auto p-3 text-left hover:bg-purple-50 hover:border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <Type className="h-4 w-4 mt-0.5 text-purple-600" />
                  <div>
                    <div className="font-medium text-sm">Heading</div>
                    <div className="text-xs text-gray-500">Section title or divider</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Implement section */}}
                className="w-full justify-start h-auto p-3 text-left mt-2 hover:bg-green-50 hover:border-green-200"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 mt-0.5 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Section</div>
                    <div className="text-xs text-gray-500">Group related fields</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Button */}
        <Button
          onClick={() => onAddField()}
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Quick Add Field
        </Button>
      </div>
    </div>
  );
};
