
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
  Building,
  Type,
  Hash,
  DollarSign,
  List,
  CheckSquare,
  Search,
  GripVertical
} from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures-enhanced';
import { EnhancedFieldEditor } from './EnhancedFieldEditor';
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

const FIELD_TYPES = [
  { type: 'text', label: 'Text Field', icon: Type, color: 'text-green-600' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, color: 'text-blue-600' },
  { type: 'number', label: 'Number Field', icon: Hash, color: 'text-orange-600' },
  { type: 'select', label: 'Multiple Choice', icon: List, color: 'text-red-600' },
  { type: 'multiselect', label: 'Checklist', icon: CheckSquare, color: 'text-purple-600' },
  { type: 'date', label: 'Inspection Check', icon: Search, color: 'text-cyan-600' }
];

export const UnifiedProcedureBuilder: React.FC<UnifiedProcedureBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  mode = 'create'
}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [scoringEnabled, setScoringEnabled] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  
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
      label: 'Field Name',
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
    setSelectedFieldIndex(formData.fields.length);
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
    setSelectedFieldIndex(formData.fields.length);
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
    setSelectedFieldIndex(null);
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
          scoringEnabled={scoringEnabled}
          onClose={() => setIsPreviewMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {formData.title || 'Untitled Procedure'}
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Scoring</Label>
                <Switch
                  checked={scoringEnabled}
                  onCheckedChange={setScoringEnabled}
                />
              </div>
              
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
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('fields')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'fields'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Procedure Fields
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'fields' ? (
          <>
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="p-8">
                <div className="max-w-4xl">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {formData.title || 'Fire Extinguisher Inspection'}
                    </h1>
                    <p className="text-gray-600">
                      {formData.description || 'Routine fire extinguisher inspection form to ensure operability.'}
                    </p>
                  </div>

                  {/* Field Editor Area */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-[400px] bg-gray-50">
                    {selectedFieldIndex !== null && formData.fields[selectedFieldIndex] ? (
                      <div className="bg-white rounded-lg p-6 border">
                        <div className="flex items-center gap-2 mb-4">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Field {selectedFieldIndex + 1}</span>
                        </div>
                        
                        <EnhancedFieldEditor
                          field={formData.fields[selectedFieldIndex]}
                          index={selectedFieldIndex}
                          totalFields={formData.fields.length}
                          scoringEnabled={scoringEnabled}
                          onUpdate={(updates) => updateField(selectedFieldIndex, updates)}
                          onDelete={() => removeField(selectedFieldIndex)}
                          onMove={(direction) => moveField(selectedFieldIndex, direction)}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-gray-500 mb-4">
                          {formData.fields.length === 0 
                            ? 'No fields added yet. Use the toolbar on the right to add your first field.'
                            : 'Select a field to edit its properties.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Fields List */}
                  {formData.fields.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Fields ({formData.fields.length})</h3>
                      <div className="space-y-2">
                        {formData.fields.map((field, index) => (
                          <div
                            key={field.id || index}
                            onClick={() => setSelectedFieldIndex(index)}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedFieldIndex === index
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">#{index + 1}</span>
                                <span className="font-medium">{field.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {field.field_type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                {field.is_required && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Field Toolbar */}
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">New Item</h3>
                  </div>
                  <Button
                    onClick={() => addField()}
                    className="w-full mb-3 justify-start gap-2"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    Field
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Type className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Heading</h3>
                  </div>
                  <Button
                    onClick={addHeading}
                    className="w-full mb-3 justify-start gap-2"
                    variant="outline"
                  >
                    <Type className="h-4 w-4" />
                    Heading
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Section</h3>
                  </div>
                  <Button
                    onClick={() => addField('section')}
                    className="w-full mb-3 justify-start gap-2"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4" />
                    Section
                  </Button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Procedure</h3>
                  </div>
                  <Button
                    className="w-full mb-3 justify-start gap-2"
                    variant="outline"
                    disabled
                  >
                    <FileText className="h-4 w-4" />
                    Procedure
                  </Button>
                </div>

                {/* Field Types Dropdown */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Field Types</h4>
                  <div className="space-y-2">
                    {FIELD_TYPES.map((fieldType) => (
                      <button
                        key={fieldType.type}
                        onClick={() => addField(fieldType.type as ProcedureField['field_type'])}
                        className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <fieldType.icon className={`h-4 w-4 ${fieldType.color}`} />
                          <span className="text-sm">{fieldType.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Settings Tab Content
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Procedure Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a clear, descriptive title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this procedure accomplishes"
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
                </CardContent>
              </Card>

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
                      placeholder="Add a tag"
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
          </div>
        )}
      </div>
    </div>
  );
};
