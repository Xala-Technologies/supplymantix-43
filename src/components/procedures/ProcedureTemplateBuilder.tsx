
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Eye, Settings, ArrowLeft, Sparkles } from "lucide-react";
import { ProcedureField } from "@/lib/database/procedures-enhanced";
import { EnhancedFieldEditor } from "./EnhancedFieldEditor";
import { FieldToolbar } from "./FieldToolbar";
import { ProcedurePreview } from "./ProcedurePreview";
import { ProcedureSettings } from "./ProcedureSettings";

interface ProcedureTemplateBuilderProps {
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

export const ProcedureTemplateBuilder: React.FC<ProcedureTemplateBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState("fields");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [scoringEnabled, setScoringEnabled] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const totalPoints = scoringEnabled ? formData.fields.reduce((sum, field) => 
    sum + (field.options?.points || 1), 0
  ) : 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Procedure' : 'Create New Procedure'}
            </h1>
            <p className="text-sm text-gray-500">{formData.title || 'Untitled Procedure'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="scoring" className="text-sm">Scoring</Label>
            <Switch
              id="scoring"
              checked={scoringEnabled}
              onCheckedChange={setScoringEnabled}
            />
            {scoringEnabled && (
              <Badge variant="outline">{totalPoints} points</Badge>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !formData.title}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isPreviewMode ? (
          <ProcedurePreview 
            procedure={formData} 
            scoringEnabled={scoringEnabled}
            onClose={() => setIsPreviewMode(false)}
          />
        ) : (
          <div className="h-full flex">
            {/* Main Editor */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="bg-white border-b px-6">
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="fields">Procedure Fields</TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="fields" className="flex-1 overflow-hidden mt-0">
                  <div className="h-full flex">
                    {/* Canvas */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      {formData.fields.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Start building your procedure
                          </h3>
                          <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Add fields, headings, and sections to create a structured procedure template
                          </p>
                          <Button onClick={() => addField()} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Your First Field
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-4xl">
                          {/* Basic Info Card */}
                          <Card className="mb-6">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-lg">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor="title">Procedure Name *</Label>
                                <Input
                                  id="title"
                                  value={formData.title}
                                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Enter procedure name"
                                  className="text-lg font-medium"
                                />
                              </div>
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={formData.description}
                                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="What needs to be done?"
                                  rows={3}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Fields */}
                          {formData.fields.map((field, index) => (
                            <EnhancedFieldEditor
                              key={field.id || index}
                              field={field}
                              index={index}
                              totalFields={formData.fields.length}
                              scoringEnabled={scoringEnabled}
                              onUpdate={(updates) => updateField(index, updates)}
                              onDelete={() => removeField(index)}
                              onMove={(direction) => moveField(index, direction)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Field Toolbar */}
                    <FieldToolbar
                      onAddField={addField}
                      onAddHeading={addHeading}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 overflow-y-auto mt-0">
                  <ProcedureSettings
                    formData={formData}
                    onUpdate={setFormData}
                    categories={CATEGORIES}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
