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
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <Input
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.options?.placeholder || ''}
              className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-200"
            />
            {field.options?.helpText && (
              <p className="text-xs text-slate-500">{field.options.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <Textarea
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.options?.placeholder || ''}
              className="w-full min-h-[100px] border-slate-200 focus:border-slate-400 focus:ring-slate-200"
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
                className="border-slate-300 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800"
              />
              <label htmlFor={field.id} className="text-sm font-medium text-slate-700">
                {field.label || field.title}
                {field.is_required && <span className="text-red-600 ml-1">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-slate-500 ml-6">{field.description}</p>
            )}
          </div>
        );

      case 'select':
      case 'radio':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
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
                      className="w-4 h-4 text-slate-800 border-slate-300 focus:ring-slate-200"
                    />
                    <label htmlFor={`${field.id}-${choiceIndex}`} className="text-sm text-slate-700">
                      {choice}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <Select value={fieldValue} onValueChange={(value) => handleFieldChange(field.id, value)}>
                <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-slate-200">
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
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <Input
              type="number"
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
              min={field.options?.minValue}
              max={field.options?.maxValue}
              step={field.options?.step || 1}
              className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-200"
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <Input
              type="date"
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-200"
            />
          </div>
        );

      case 'section':
        return (
          <div key={field.id || index} className="py-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
              {field.label || field.title}
            </h3>
            {field.description && (
              <p className="text-sm text-slate-600 mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'info':
        return (
          <div key={field.id || index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-900">{field.label || field.title}</h4>
                {field.options?.infoText && (
                  <p className="text-sm text-slate-600 mt-1">{field.options.infoText}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={field.id || index} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {field.label || field.title}
              {field.is_required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <Input
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full border-slate-200 focus:border-slate-400 focus:ring-slate-200"
            />
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader className="flex-shrink-0 bg-white border-b border-slate-200 p-6 -m-6 mb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-slate-900 mb-2">
                  {procedure.title}
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200">
                    {procedure.category || 'Other'}
                  </Badge>
                  {procedure.is_global && (
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200">
                      <Globe className="h-3 w-3 mr-1" />
                      Global
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="fields" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-slate-50 p-1 m-6 mb-0 rounded-lg">
              <TabsTrigger 
                value="fields" 
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Fields
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                History
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <TabsContent value="fields" className="mt-6 space-y-6">
                {procedure.fields && procedure.fields.length > 0 ? (
                  <div className="space-y-6">
                    {procedure.fields.map((field: any, index: number) => (
                      <Card key={field.id || index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          {renderField(field, index)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Fields Configured</h3>
                    <p className="text-slate-600">This procedure doesn't have any fields set up yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="mt-6 space-y-6">
                {/* Description */}
                {procedure.description && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-900">
                        <FileText className="h-5 w-5 text-slate-600" />
                        Description
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {procedure.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="text-2xl font-semibold text-slate-900 mb-1">
                        {procedure.fields?.length || 0}
                      </div>
                      <div className="text-sm text-slate-600">Steps</div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="text-2xl font-semibold text-slate-900 mb-1">
                        {procedure.executions_count || 0}
                      </div>
                      <div className="text-sm text-slate-600">Executions</div>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="text-2xl font-semibold text-slate-900 mb-1">
                        {procedure.estimated_duration || 30}
                      </div>
                      <div className="text-sm text-slate-600">Minutes</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Procedure Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-slate-900">Procedure Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500">Created by</span>
                            <p className="text-sm font-medium text-slate-900">{procedure.created_by || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500">Created</span>
                            <p className="text-sm font-medium text-slate-900">
                              {procedure.created_at ? formatDate(procedure.created_at) : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500">Last updated</span>
                            <p className="text-sm font-medium text-slate-900">
                              {procedure.updated_at ? formatDate(procedure.updated_at) : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-slate-900">Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Tag className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500">Category</span>
                            <div className="mt-1">
                              <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                {procedure.category || 'Other'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Globe className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500">Scope</span>
                            <p className="text-sm font-medium text-slate-900">
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
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No Execution History</h3>
                      <p className="text-slate-600">This procedure hasn't been executed yet.</p>
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
