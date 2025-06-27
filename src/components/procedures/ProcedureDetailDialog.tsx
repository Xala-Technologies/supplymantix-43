import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  CheckCircle, 
  Activity, 
  Calendar,
  User,
  Tag,
  FileText,
  Clock,
  PlayCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

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

  // Initialize edit data when procedure changes or dialog opens
  useEffect(() => {
    if (procedure && open) {
      setEditData({
        title: procedure.title || '',
        description: procedure.description || '',
        category: procedure.category || 'Inspection',
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

  const renderField = (field: any, index: number) => {
    const fieldValue = formData[field.id] || field.options?.defaultValue || '';

    switch (field.field_type || field.type) {
      case 'text':
        return (
          <div key={field.id || index} className="space-y-3">
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
          <div key={field.id || index} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.options?.placeholder || ''}
              className="w-full min-h-[100px]"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id || index} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={field.id}
                checked={fieldValue === true}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              />
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label || field.title}
                {field.is_required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
          </div>
        );

      case 'select':
      case 'radio':
        return (
          <div key={field.id || index} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.field_type === 'radio' ? (
              <div className="flex gap-4">
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
          <div key={field.id || index} className="space-y-3">
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
          <div key={field.id || index} className="space-y-3">
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
          <div key={field.id || index} className="py-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {field.label || field.title}
            </h3>
            {field.description && (
              <p className="text-sm text-gray-600 mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'info':
        return (
          <div key={field.id || index} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
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
          <div key={field.id || index} className="space-y-3">
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader className="flex-shrink-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 p-8 -m-6 mb-0 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                <PlayCircle className="h-8 w-8 text-gray-700" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold mb-3 border-2 border-gray-200 focus:border-gray-400 rounded-lg px-4 py-2 bg-white"
                    placeholder="Procedure title"
                  />
                ) : (
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {procedure.title}
                  </DialogTitle>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditing ? (
                    <Select
                      value={editData.category}
                      onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="w-48 bg-white border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1 text-sm font-medium">
                      {procedure.category || 'Other'}
                    </Badge>
                  )}
                  {(isEditing ? editData.is_global : procedure.is_global) && (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-3 py-1 text-sm font-medium">
                      <Globe className="h-4 w-4 mr-1" />
                      Global
                    </Badge>
                  )}
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {procedure.fields?.length || 0} fields
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 ml-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleEditSave} 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleEditCancel} 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEditStart} 
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Procedure
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="fields" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50/50 p-1 m-6 mb-0 rounded-xl border border-gray-100">
              <TabsTrigger 
                value="fields" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium"
              >
                Fields & Content
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium"
              >
                Details & Settings
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium"
              >
                History & Analytics
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="fields" className="mt-6 space-y-6">
                {procedure.fields && procedure.fields.length > 0 ? (
                  <div className="space-y-6">
                    {procedure.fields.map((field: any, index: number) => (
                      <Card key={field.id || index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                        <CardContent className="p-6">
                          {renderField(field, index)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Fields Configured</h3>
                    <p className="text-gray-600 max-w-md mx-auto">This procedure doesn't have any fields set up yet. Edit the procedure to add fields and content.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-6">
                {/* Description */}
                <Card className="border border-gray-100 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold flex items-center gap-3 mb-4 text-gray-900">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      Description
                    </h3>
                    {isEditing ? (
                      <Textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter procedure description"
                        className="w-full min-h-[120px] border-gray-200 focus:border-gray-400"
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {procedure.description || 'No description provided'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Global Setting */}
                {isEditing && (
                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium text-gray-900">Global Procedure</Label>
                            <p className="text-sm text-gray-600">Available to all users across organizations</p>
                          </div>
                        </div>
                        <Switch
                          checked={editData.is_global}
                          onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_global: checked }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {procedure.fields?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Fields</div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {procedure.executions_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">Executions</div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {procedure.estimated_duration || 30}
                      </div>
                      <div className="text-sm text-gray-600">Minutes</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Procedure Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-6 text-gray-900">Procedure Information</h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Created by</span>
                            <p className="text-sm font-medium text-gray-900">{procedure.created_by || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Created</span>
                            <p className="text-sm font-medium text-gray-900">
                              {procedure.created_at ? formatDate(procedure.created_at) : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Last updated</span>
                            <p className="text-sm font-medium text-gray-900">
                              {procedure.updated_at ? formatDate(procedure.updated_at) : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-100 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-6 text-gray-900">Configuration</h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Tag className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Category</span>
                            <div className="mt-1">
                              <Badge className="bg-white text-gray-700 border border-gray-200 text-sm">
                                {procedure.category || 'Other'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Globe className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Scope</span>
                            <p className="text-sm font-medium text-gray-900">
                              {procedure.is_global ? 'Global' : 'Local'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card className="border border-gray-100 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <Activity className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No Execution History</h3>
                      <p className="text-gray-600 max-w-md mx-auto">This procedure hasn't been executed yet. Once it's used, execution history and analytics will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
