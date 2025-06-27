
import React, { useState } from 'react';
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
import { 
  Globe, 
  CheckCircle, 
  Activity, 
  Calendar,
  User,
  Tag,
  FileText,
  Edit,
  Copy,
  Trash2,
  Clock,
  PlayCircle
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

export const ProcedureDetailDialog: React.FC<ProcedureDetailDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  onEdit,
  onDuplicate,
  onDelete,
  getCategoryColor
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  if (!procedure) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              className="w-full min-h-[100px]"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id || index} className="space-y-2">
            <div className="flex items-center space-x-2">
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
          <div key={field.id || index} className="space-y-2">
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
                      className="w-4 h-4 text-blue-600"
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
          <div key={field.id || index} className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">{field.label || field.title}</h4>
                {field.options?.infoText && (
                  <p className="text-sm text-blue-700 mt-1">{field.options.infoText}</p>
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 bg-blue-600 text-white p-6 -m-6 mb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {procedure.title}
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {procedure.category || 'Other'}
                  </Badge>
                  {procedure.is_global && (
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Globe className="h-3 w-3 mr-1" />
                      Global
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(procedure)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="fields" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 m-6 mb-0">
              <TabsTrigger value="fields" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                Fields
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                Details
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                History
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="fields" className="mt-6 space-y-6">
                {procedure.fields && procedure.fields.length > 0 ? (
                  <div className="space-y-6">
                    {procedure.fields.map((field: any, index: number) => (
                      <Card key={field.id || index} className="border-gray-200">
                        <CardContent className="p-4">
                          {renderField(field, index)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Fields Configured</h3>
                    <p className="text-gray-600">This procedure doesn't have any fields set up yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-6">
                {/* Description */}
                {procedure.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-gray-600" />
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {procedure.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {procedure.fields?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Steps</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {procedure.executions_count || 0}
                      </div>
                      <div className="text-sm text-gray-600">Executions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {procedure.estimated_duration || 30}
                      </div>
                      <div className="text-sm text-gray-600">Minutes</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Procedure Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Procedure Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Created by:</span>
                          <span className="text-sm font-medium">{procedure.created_by || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Created:</span>
                          <span className="text-sm font-medium">
                            {procedure.created_at ? formatDate(procedure.created_at) : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Last updated:</span>
                          <span className="text-sm font-medium">
                            {procedure.updated_at ? formatDate(procedure.updated_at) : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Configuration</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Category:</span>
                          <Badge className={`${getCategoryColor(procedure.category || 'Other')} text-xs`}>
                            {procedure.category || 'Other'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Scope:</span>
                          <span className="text-sm font-medium">
                            {procedure.is_global ? 'Global' : 'Local'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Execution History</h3>
                      <p className="text-gray-600">This procedure hasn't been executed yet.</p>
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
