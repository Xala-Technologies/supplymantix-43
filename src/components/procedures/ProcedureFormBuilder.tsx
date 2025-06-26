
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
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: formData.fields.length,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      fields: prev.fields.filter((_, i) => i !== index).map((field, i) => ({
        ...field,
        order_index: i
      }))
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.fields.length - 1) return;

    const newFields = [...formData.fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    // Update order_index
    newFields[index].order_index = index;
    newFields[newIndex].order_index = newIndex;
    
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
    <div className="w-full h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Compact Header */}
        <div className="text-center py-2 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              {initialData ? 'Edit Procedure' : 'Create New Procedure'}
            </h2>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Column - Basic Info */}
          <div className="w-1/2 border-r overflow-y-auto">
            <div className="p-3 space-y-3">
              {/* Basic Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <Building className="h-3 w-3" />
                  Basic Information
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-medium">Procedure Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter procedure title"
                    required
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-medium">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`}></div>
                            {category}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this procedure"
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-1 min-h-[24px] p-2 border rounded text-xs bg-gray-50">
                    {formData.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs px-1 py-0 cursor-pointer hover:bg-red-100 hover:text-red-700" 
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                    {formData.tags.length === 0 && (
                      <span className="text-gray-500 text-xs">No tags</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 h-7 text-xs"
                    />
                    <Button type="button" onClick={addTag} size="sm" variant="outline" className="h-7 px-2 text-xs">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-blue-600" />
                    <div>
                      <Label htmlFor="is_global" className="text-xs font-medium">Global Procedure</Label>
                      <p className="text-xs text-gray-600">Available to all users</p>
                    </div>
                  </div>
                  <Switch
                    id="is_global"
                    checked={formData.is_global}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_global: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Fields */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <Sparkles className="h-3 w-3" />
                  Procedure Fields ({formData.fields.length})
                </div>
                <Button type="button" onClick={addField} size="sm" className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              {formData.fields.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                  <Sparkles className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No fields added yet</h3>
                  <p className="text-xs text-gray-600 mb-3">Add fields to create a structured procedure</p>
                  <Button type="button" onClick={addField} variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Your First Field
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.fields.map((field, index) => (
                    <FieldEditor
                      key={field.id || index}
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
            </div>
          </div>
        </div>

        {/* Fixed Actions Footer */}
        <div className="flex justify-end space-x-2 p-3 bg-gray-50 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={onCancel} className="h-8 text-sm">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !formData.title}
            className="bg-blue-600 hover:bg-blue-700 h-8 text-sm"
          >
            <Save className="h-3 w-3 mr-1" />
            {isLoading ? 'Saving...' : 'Save Procedure'}
          </Button>
        </div>
      </form>
    </div>
  );
};
