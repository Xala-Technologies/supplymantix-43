
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Globe, Building, Sparkles } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";
import { FieldEditor } from "./FieldEditor";

interface ProcedureFormBuilderProps {
  initialData?: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  };
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    is_global: boolean;
    fields: ProcedureField[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Inspection',
  'Safety',
  'Calibration', 
  'Reactive Maintenance',
  'Preventive Maintenance',
  'Quality Control',
  'Training',
  'Other'
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Inspection": "bg-blue-100 text-blue-700",
    "Safety": "bg-green-100 text-green-700", 
    "Calibration": "bg-purple-100 text-purple-700",
    "Reactive Maintenance": "bg-red-100 text-red-700",
    "Preventive Maintenance": "bg-orange-100 text-orange-700",
    "Quality Control": "bg-indigo-100 text-indigo-700",
    "Training": "bg-yellow-100 text-yellow-700",
    "Other": "bg-gray-100 text-gray-700"
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export const ProcedureFormBuilder: React.FC<ProcedureFormBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || []
  });

  const [newTag, setNewTag] = useState('');

  const addField = () => {
    const newField: ProcedureField = {
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      field_order: formData.fields.length,
      options: {}
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, field: Partial<ProcedureField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.fields.length - 1) return;

    const newFields = [...formData.fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    // Update field_order
    newFields[index].field_order = index;
    newFields[newIndex].field_order = newIndex;
    
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Procedure' : 'Create New Procedure'}
            </h2>
          </div>
          <p className="text-gray-600">
            Build standardized procedures with custom fields and validation
          </p>
        </div>

        {/* Basic Information */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Procedure Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter procedure title"
                  required
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this procedure covers and when to use it"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Tags</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-gray-50">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100 hover:text-red-700" 
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                  {formData.tags.length === 0 && (
                    <span className="text-gray-500 text-sm">No tags added</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} size="sm" variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label htmlFor="is_global" className="font-medium">
                      Global Procedure
                    </Label>
                    <p className="text-sm text-gray-600">
                      Available to all users in your organization
                    </p>
                  </div>
                </div>
                <Switch
                  id="is_global"
                  checked={formData.is_global}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_global: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fields Section */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Procedure Fields ({formData.fields.length})
              </CardTitle>
              <Button type="button" onClick={addField} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {formData.fields.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                <p className="text-gray-600 mb-4">
                  Add fields to create a structured procedure that guides users through each step
                </p>
                <Button type="button" onClick={addField} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <FieldEditor
                    key={index}
                    field={field}
                    index={index}
                    totalFields={formData.fields.length}
                    onUpdate={(updates) => updateField(index, updates)}
                    onDelete={() => removeField(index)}
                    onMove={(direction) => moveField(index, direction)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !formData.title}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Procedure'}
          </Button>
        </div>
      </form>
    </div>
  );
};
