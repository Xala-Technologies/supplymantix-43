
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  Trash2
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
  if (!procedure) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {procedure.title}
              </DialogTitle>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${getCategoryColor(procedure.category || 'Other')}`}>
                  {procedure.category || 'Other'}
                </Badge>
                {procedure.is_global && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Globe className="h-3 w-3 mr-1" />
                    Global
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(procedure)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(procedure.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(procedure.id)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {procedure.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {procedure.description}
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {procedure.fields?.length || 0}
              </div>
              <div className="text-sm text-blue-700">Steps</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">
                {procedure.executions_count || 0}
              </div>
              <div className="text-sm text-green-700">Executions</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {procedure.estimated_duration || 30}
              </div>
              <div className="text-sm text-purple-700">Minutes</div>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Details</h3>
              
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration</h3>
              
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
            </div>
          </div>

          {/* Steps/Fields */}
          {procedure.fields && procedure.fields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                  Procedure Steps ({procedure.fields.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {procedure.fields.map((field: any, index: number) => (
                    <div key={field.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{field.label || field.title}</h4>
                        {field.description && (
                          <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {field.type || field.fieldType || 'text'}
                          </Badge>
                          {field.required && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
