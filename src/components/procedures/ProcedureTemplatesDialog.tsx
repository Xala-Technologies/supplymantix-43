
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Loader2, Download } from "lucide-react";

interface ProcedureTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: any[] | undefined;
  templatesLoading: boolean;
  onCreateFromTemplate: (template: any) => void;
  createProcedureLoading: boolean;
}

export const ProcedureTemplatesDialog: React.FC<ProcedureTemplatesDialogProps> = ({
  open,
  onOpenChange,
  templates,
  templatesLoading,
  onCreateFromTemplate,
  createProcedureLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import from Templates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {templatesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading templates...</p>
            </div>
          ) : !templates || templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
              <p className="text-gray-600">Create procedures first to save them as templates</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2">
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex gap-1">
                              {template.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          {template.is_public && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="h-3 w-3 mr-1" />
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => onCreateFromTemplate(template)}
                        disabled={createProcedureLoading}
                      >
                        {createProcedureLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-1" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
