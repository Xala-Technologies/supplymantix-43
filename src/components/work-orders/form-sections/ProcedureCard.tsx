import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Eye, Edit, Trash2, FileText, Clock } from "lucide-react";

interface ProcedureItem {
  id: string;
  title: string;
  description?: string;
  steps?: Array<{
    id: string;
    title: string;
    type: 'text' | 'checkbox' | 'number' | 'file';
    required?: boolean;
    options?: string[];
  }>;
  fields?: Array<{
    id: string;
    label: string;
    field_type: string;
    is_required?: boolean;
    options?: any;
  }>;
  estimatedDuration?: number;
  estimated_duration?: number;
  category?: string;
}

interface ProcedureCardProps {
  procedure: ProcedureItem;
  onEdit?: (procedure: ProcedureItem) => void;
  onDelete?: (procedureId: string) => void;
  onPreview?: (procedure: ProcedureItem) => void;
}

export const ProcedureCard = ({ procedure, onEdit, onDelete, onPreview }: ProcedureCardProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
    onPreview?.(procedure);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <h3 className="font-medium text-gray-900 truncate">{procedure.title}</h3>
                {procedure.category && (
                  <Badge variant="secondary" className="text-xs">
                    {procedure.category}
                  </Badge>
                )}
              </div>
              
              {procedure.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {procedure.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {(procedure.fields || procedure.steps) && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{(procedure.fields || procedure.steps).length} fields</span>
                  </div>
                )}
                {(procedure.estimated_duration || procedure.estimatedDuration) && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(procedure.estimatedDuration)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Preview</span>
              </Button>
              
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(procedure)}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(procedure.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              {procedure.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {procedure.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{procedure.description}</p>
              </div>
            )}
            
            {(procedure.fields || procedure.steps) && (procedure.fields || procedure.steps).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Fields</h4>
                <div className="space-y-3">
                  {(procedure.fields || procedure.steps).map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900">
                              {field.label || field.title}
                            </h5>
                            {(field.is_required || field.required) && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          
          {(field.field_type === 'checkbox' || field.type === 'checkbox') && field.options && (
            <div className="space-y-2 mt-2">
              {Array.isArray(field.options.choices) ? field.options.choices.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center gap-2 text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    disabled 
                    className="rounded border-gray-300"
                  />
                  {option}
                </label>
              )) : Array.isArray(field.options) ? field.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center gap-2 text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    disabled 
                    className="rounded border-gray-300"
                  />
                  {option}
                </label>
              )) : null}
                            </div>
                          )}
                          
                          {(field.field_type === 'text' || field.type === 'text') && (
                            <div className="mt-2">
                              <input 
                                type="text" 
                                disabled 
                                placeholder="Text input"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                              />
                            </div>
                          )}
                          
                          {(field.field_type === 'number' || field.type === 'number') && (
                            <div className="mt-2">
                              <input 
                                type="number" 
                                disabled 
                                placeholder="Number input"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                              />
                            </div>
                          )}
                          
                          {(field.field_type === 'file' || field.type === 'file') && (
                            <div className="mt-2">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50">
                                <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">File upload area</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {procedure.estimatedDuration && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <Clock className="h-4 w-4" />
                <span>Estimated completion time: {formatDuration(procedure.estimatedDuration)}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};