
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Settings, 
  FileText, 
  Users, 
  Tag,
  Globe,
  Building
} from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { EnhancedFieldEditor } from './EnhancedFieldEditor';
import { FieldToolbar } from './FieldToolbar';
import { ProcedurePreview } from './ProcedurePreview';

interface UnifiedProcedureBuilderProps {
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
  mode?: 'create' | 'edit';
}

const CATEGORIES = [
  { value: 'Inspection', label: 'Inspection', color: 'bg-blue-500' },
  { value: 'Safety', label: 'Safety', color: 'bg-red-500' },
  { value: 'Calibration', label: 'Calibration', color: 'bg-purple-500' },
  { value: 'Reactive Maintenance', label: 'Reactive Maintenance', color: 'bg-orange-500' },
  { value: 'Preventive Maintenance', label: 'Preventive Maintenance', color: 'bg-green-500' },
  { value: 'Quality Control', label: 'Quality Control', color: 'bg-indigo-500' },
  { value: 'Training', label: 'Training', color: 'bg-yellow-500' },
  { value: 'Other', label: 'Other', color: 'bg-gray-500' }
];

export const UnifiedProcedureBuilder: React.FC<UnifiedProcedureBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const [activeTab, setActiveTab] = useState('builder');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Inspection',
    tags: initialData?.tags || [],
    is_global: initialData?.is_global || false,
    fields: initialData?.fields || []
  });

  const addField = (type: ProcedureField['field_type'] = 'text') => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'New Field',
      field_type: type,
      is_required: false,
      order_index: formData.fields.length,
      options: type === 'select' || type === 'multiselect' ? { choices: [] } : {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const addHeading = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: '',
      label: 'Section Heading',
      field_type: 'section',
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
    
    newFields[index].order_index = index;
    newFields[newIndex].order_index = newIndex;
    
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
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

  if (isPreviewMode) {
    return (
      <div className="h-screen bg-gray-50">
        <ProcedurePreview 
          procedure={formData} 
          onClose={() => setIsPreviewMode(false)}
        />
      </div>
    );
  }

  const selectedCategory = CATEGORIES.find(cat => cat.value === formData.category);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {mode === 'edit' ? 'Edit Procedure' : 'Create New Procedure'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {formData.title ? (
                    <span className="text-sm text-gray-600">{formData.title}</span>
                  ) : (
                    <span className="text-sm text-gray-400">Untitled Procedure</span>
                  )}
                  {selectedCategory && (
                    <Badge variant="outline" className="gap-1">
                      <div className={`w-2 h-2 rounded-full ${selectedCategory.color}`} />
                      {selectedCategory.label}
                    </Badge>
                  )}
                  {formData.fields.length > 0 && (
                    <Badge variant="secondary">
                      {formData.fields.length} field{formData.fields.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewMode(true)}
                className="gap-2"
                disabled={!formData.title}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !formData.title.trim()}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Procedure' : 'Create Procedure'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="bg-white border-b px-6">
            <TabsList className="grid w-fit grid-cols-2 bg-gray-100">
              <TabsTrigger value="builder" className="gap-2">
                <FileText className="h-4 w-4" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="flex-1 overflow-hidden mt-0">
            <div className="h-full flex">
              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                  {/* Basic Information Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="title">Procedure Title *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter a clear, descriptive title"
                            className="text-lg font-medium"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe what this procedure accomplishes and when it should be used"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fields Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Plus className="h-5 w-5 text-green-600" />
                          Procedure Fields
                          {formData.fields.length > 0 && (
                            <Badge variant="secondary">{formData.fields.length}</Badge>
                          )}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {formData.fields.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Start building your procedure
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add fields to collect information, create checklists, or guide users through steps
                          </p>
                          <Button onClick={() => addField()} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Your First Field
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formData.fields.map((field, index) => (
                            <EnhancedFieldEditor
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
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Field Toolbar */}
              <FieldToolbar
                onAddField={addField}
                onAddHeading={addHeading}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto mt-0 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-purple-600" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-gray-50">
                    {formData.tags.length === 0 && (
                      <span className="text-gray-500 text-sm">No tags added yet</span>
                    )}
                    {formData.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors" 
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., monthly, critical, equipment)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Visibility & Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {formData.is_global ? (
                          <Globe className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Building className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="is_global" className="text-base font-medium">
                          {formData.is_global ? 'Global Procedure' : 'Organization Only'}
                        </Label>
                        <p className="text-sm text-gray-600">
                          {formData.is_global 
                            ? 'Available to all users across organizations' 
                            : 'Only available to your organization members'
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="is_global"
                      checked={formData.is_global}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_global: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
