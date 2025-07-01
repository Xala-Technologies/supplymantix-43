import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  CheckCircle, 
  Calendar,
  User,
  Tag,
  FileText,
  PlayCircle,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';
import { ProcedureField } from '@/lib/database/procedures/types';

interface ProcedureDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any | null;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
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

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' },
  { value: 'section', label: 'Section Header' },
  { value: 'info', label: 'Information' }
];

export const ProcedureDetailDialog: React.FC<ProcedureDetailDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [newTag, setNewTag] = useState('');

  // Initialize edit data when procedure changes or dialog opens
  useEffect(() => {
    if (procedure && open) {
      setEditData({
        title: procedure.title || '',
        description: procedure.description || '',
        category: procedure.category || 'Inspection',
        tags: procedure.tags || [],
        is_global: procedure.is_global || false,
        fields: procedure.fields || []
      });
      setFormData({});
    }
  }, [procedure, open]);

  if (!procedure) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    try {
      onEdit({ ...procedure, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving procedure:', error);
    }
  };

  const handleEditCancel = () => {
    // Reset to original procedure data
    setEditData({
      title: procedure.title || '',
      description: procedure.description || '',
      category: procedure.category || 'Inspection',
      tags: procedure.tags || [],
      is_global: procedure.is_global || false,
      fields: procedure.fields || []
    });
    setIsEditing(false);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const addField = () => {
    const newField: ProcedureField = {
      id: crypto.randomUUID(),
      procedure_id: procedure.id,
      label: 'New Field',
      field_type: 'text',
      is_required: false,
      order_index: editData.fields.length,
      options: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEditData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, updates: Partial<ProcedureField>) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.map((field: ProcedureField, i: number) => 
        i === index ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (index: number) => {
    setEditData(prev => ({
      ...prev,
      fields: prev.fields.filter((_: any, i: number) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const fields = [...editData.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [fields[index], fields[targetIndex]] = [fields[targetIndex], fields[index]];
      
      // Update order indexes
      fields.forEach((field, i) => {
        field.order_index = i;
      });
      
      setEditData(prev => ({ ...prev, fields }));
    }
  };

  const renderField = (field: any, index: number) => {
    const fieldValue = formData[field.id] || field.options?.defaultValue || '';

    switch (field.field_type || field.type) {
      case 'text':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.options?.placeholder || ''}
              className="w-full"
            />
            {field.options?.helpText && (
              <p className="text-xs text-gray-500">{field.options.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.options?.placeholder || ''}
              className="w-full min-h-[80px]"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id || index} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={Boolean(fieldValue)}
                onCheckedChange={(checked) => handleFieldChange(field.id, Boolean(checked))}
              />
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label || field.title}
                {field.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-5">{field.description}</p>
            )}
          </div>
        );

      case 'select':
      case 'radio':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.field_type === 'radio' ? (
              <div className="flex gap-3">
                {field.options?.choices?.map((choice: string, choiceIndex: number) => (
                  <div key={choiceIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${field.id}-${choiceIndex}`}
                      name={field.id}
                      value={choice}
                      checked={fieldValue === choice}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-4 h-4 text-gray-600"
                    />
                    <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-gray-700">
                      {choice}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <Select value={fieldValue} onValueChange={(value) => handleFieldChange(field.id, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.choices?.map((choice: string, choiceIndex: number) => (
                    <SelectItem key={choiceIndex} value={choice}>
                      {choice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
              min={field.options?.minValue}
              max={field.options?.maxValue}
              step={field.options?.step || 1}
              className="w-full"
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="date"
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full"
            />
          </div>
        );

      case 'section':
        return (
          <div key={field.id || index} className="py-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-1">
              {field.label || field.title}
            </h3>
            {field.description && (
              <p className="text-sm text-gray-600 mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'info':
        return (
          <div key={field.id || index} className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">{field.label || field.title}</h4>
                {field.options?.infoText && (
                  <p className="text-sm text-gray-600 mt-1">{field.options.infoText}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full"
            />
          </div>
        );
    }
  };

  const renderFieldEditor = (field: ProcedureField, index: number) => {
    return (
      <Card key={field.id} className="border border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            {/* Drag Handle */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <Badge variant="outline" className="text-xs px-1 py-0">
                {index + 1}
              </Badge>
            </div>

            {/* Field Configuration */}
            <div className="flex-1 space-y-3">
              {/* Field Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Field Label *</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    placeholder="Enter field label"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Field Type</Label>
                  <Select 
                    value={field.field_type} 
                    onValueChange={(value) => updateField(index, { field_type: value as ProcedureField['field_type'] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Options for Select/Multiselect */}
              {(field.field_type === 'select' || field.field_type === 'multiselect' || field.field_type === 'radio') && (
                <div>
                  <Label className="text-sm font-medium">Options (one per line)</Label>
                  <Textarea
                    value={field.options?.choices?.join('\n') || ''}
                    onChange={(e) =>
                      updateField(index, {
                        options: { 
                          ...field.options, 
                          choices: e.target.value.split('\n').filter(Boolean) 
                        }
                      })
                    }
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              )}

              {/* Field Settings */}
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${index}`}
                      checked={Boolean(field.is_required)}
                      onCheckedChange={(checked) => updateField(index, { is_required: Boolean(checked) })}
                    />
                    <Label htmlFor={`required-${index}`} className="text-sm">Required</Label>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveField(index, 'up')}
                    disabled={index === 0}
                    className="h-7 w-7 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveField(index, 'down')}
                    disabled={index === editData.fields.length - 1}
                    className="h-7 w-7 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(index)}
                    className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-gray-600" />
              {isEditing ? (
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold"
                  placeholder="Procedure title"
                />
              ) : (
                <DialogTitle className="text-lg font-semibold">
                  {procedure.title}
                </DialogTitle>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleEditSave} size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleEditCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleEditStart} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Select
                value={editData.category}
                onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary">
                {procedure.category || 'Other'}
              </Badge>
            )}
            {(isEditing ? editData.is_global : procedure.is_global) && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Globe className="h-3 w-3 mr-1" />
                Global
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              {(isEditing ? editData.fields : procedure.fields)?.length || 0} fields
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue={isEditing ? "settings" : "fields"} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">
                {isEditing ? 'Edit Fields' : 'Fields'}
              </TabsTrigger>
              <TabsTrigger value="settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="fields" className="space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Procedure Fields</h3>
                      <Button onClick={addField} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                    
                    {editData.fields?.length > 0 ? (
                      <div className="space-y-3">
                        {editData.fields.map((field: ProcedureField, index: number) => 
                          renderFieldEditor(field, index)
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-medium text-gray-900 mb-2">No Fields Yet</h3>
                        <p className="text-gray-500 mb-3">Add fields to build your procedure form.</p>
                        <Button onClick={addField} size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add First Field
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // View mode for fields
                  procedure.fields && procedure.fields.length > 0 ? (
                    <div className="space-y-3">
                      {procedure.fields.map((field: any, index: number) => (
                        <Card key={field.id || index}>
                          <CardContent className="p-3">
                            {renderField(field, index)}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">No Fields</h3>
                      <p className="text-gray-500">This procedure doesn't have any fields yet.</p>
                    </div>
                  )
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label>Title *</Label>
                          <Input
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Procedure title"
                          />
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Procedure description"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Category</Label>
                          <Select
                            value={editData.category}
                            onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Tags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {editData.tags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button onClick={addTag} size="sm">
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Visibility</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Global Procedure</Label>
                            <p className="text-sm text-gray-600">Available to all users</p>
                          </div>
                          <Switch
                            checked={Boolean(editData.is_global)}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_global: Boolean(checked) }))}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-700">
                          {procedure.description || 'No description provided'}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>Created by {procedure.created_by || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>
                                {procedure.created_at ? formatDate(procedure.created_at) : 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-400" />
                              <Badge variant="secondary">
                                {procedure.category || 'Other'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                              <span>{procedure.fields?.length || 0} fields</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
