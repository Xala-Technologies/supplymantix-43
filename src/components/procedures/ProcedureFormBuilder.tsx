
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  X,
  FileText,
  Settings,
  Eye
} from "lucide-react";
import { FieldEditor } from "./FieldEditor";
import { ProcedureField, ProcedureWithFields } from "@/lib/database/procedures-enhanced";

interface ProcedureFormBuilderProps {
  initialData?: ProcedureWithFields;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProcedureFormBuilder: React.FC<ProcedureFormBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Other');
  const [isGlobal, setIsGlobal] = useState(initialData?.is_global || false);
  const [fields, setFields] = useState<ProcedureField[]>(initialData?.fields || []);

  const categories = [
    "Inspection",
    "Safety", 
    "Calibration",
    "Reactive Maintenance",
    "Preventive Maintenance",
    "Quality Control",
    "Training",
    "Other"
  ];

  const addField = () => {
    const newField: ProcedureField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      options: null
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updatedField: Partial<ProcedureField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updatedField };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    
    setFields(newFields);
  };

  const handleSave = () => {
    const procedureData = {
      title,
      description,
      category,
      is_global: isGlobal,
      fields: fields.map((field, index) => ({
        ...field,
        order_index: index
      }))
    };
    onSave(procedureData);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <h2 className="text-sm font-semibold">
            {initialData ? 'Edit Procedure' : 'Create Procedure'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20 h-6 px-2">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Form Details */}
        <div className="w-1/3 border-r bg-white overflow-y-auto">
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-gray-900 text-sm">Basic Information</h3>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-medium">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter procedure title"
                className="h-7 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-medium">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter procedure description"
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-1">
              <Label htmlFor="global" className="text-xs font-medium">Global Procedure</Label>
              <Switch
                id="global"
                checked={isGlobal}
                onCheckedChange={setIsGlobal}
              />
            </div>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-600" />
                <h3 className="font-medium text-gray-900 text-sm">Fields ({fields.length})</h3>
              </div>
              <Button onClick={addField} size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-3 text-gray-500">
                <FileText className="h-6 w-6 mx-auto mb-1 opacity-50" />
                <p className="text-xs">No fields added yet</p>
                <p className="text-xs text-gray-400">Click "Add" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Field Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {fields.map((field, index) => (
              <FieldEditor
                key={field.id || index}
                field={field}
                index={index}
                totalFields={fields.length}
                onUpdate={(updatedField) => updateField(index, updatedField)}
                onDelete={() => removeField(index)}
                onMove={(direction) => moveField(index, direction)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="border-t bg-white p-2 flex justify-between items-center">
        <div className="text-xs text-gray-600">
          {fields.length} field{fields.length !== 1 ? 's' : ''} configured
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} size="sm" className="h-6 text-xs px-2">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || isLoading}
            size="sm"
            className="h-6 text-xs px-2 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white mr-1"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
