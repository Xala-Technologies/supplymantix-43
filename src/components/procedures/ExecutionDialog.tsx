
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  CheckCircle,
  Clock,
  FileText,
  User,
  X
} from "lucide-react";
import { ProcedureExecution } from "./ProcedureExecution";

interface ExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any;
  executionId?: string;
  onComplete: (answers: any, score: number) => void;
  onCancel: () => void;
}

export const ExecutionDialog: React.FC<ExecutionDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  executionId,
  onComplete,
  onCancel
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  if (!procedure) {
    return null;
  }

  const handleStart = () => {
    setIsExecuting(true);
  };

  const handleComplete = (answers: any, score: number) => {
    setIsExecuting(false);
    onComplete(answers, score);
  };

  const handleCancel = () => {
    setIsExecuting(false);
    onCancel();
  };

  const handleBack = () => {
    setIsExecuting(false);
  };

  // Single Window - Start or Execution
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        {!isExecuting ? (
          // Compact Start Screen
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{procedure.title}</h2>
                  <p className="text-sm text-gray-600">Ready to execute</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-3">
              {procedure.description && (
                <p className="text-gray-700 text-sm">{procedure.description}</p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="border-blue-100">
                  <CardContent className="p-3 text-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{procedure.fields?.length || 0}</p>
                    <p className="text-xs text-gray-600">Steps</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-100">
                  <CardContent className="p-3 text-center">
                    <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="font-semibold text-sm">~{Math.ceil((procedure.fields?.length || 1) * 1.5)}</p>
                    <p className="text-xs text-gray-600">Minutes</p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-100">
                  <CardContent className="p-3 text-center">
                    <FileText className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="font-semibold text-sm">{procedure.executions_count || 0}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tags */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {procedure.category && (
                    <Badge variant="secondary" className="text-xs">
                      {procedure.category}
                    </Badge>
                  )}
                  {procedure.is_global && (
                    <Badge variant="outline" className="text-xs">
                      Global
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>Assigned to you</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleStart} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Execution
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Execution View
          <ProcedureExecution
            procedure={procedure}
            executionId={executionId}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
