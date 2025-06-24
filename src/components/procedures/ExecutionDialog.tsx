
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  CheckCircle,
  Clock,
  FileText,
  User,
  ArrowLeft
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

  // Modern Start Screen
  if (!isExecuting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Play className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Start Procedure: {procedure.title}
            </DialogTitle>
            <p className="text-gray-600 text-sm mt-2">
              {procedure.description || "Execute this procedure step by step"}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Procedure Overview */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{procedure.fields?.length || 0}</p>
                    <p className="text-xs text-gray-600">Steps</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">~{Math.ceil((procedure.fields?.length || 1) * 1.5)}</p>
                    <p className="text-xs text-gray-600">Minutes</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{procedure.executions_count || 0}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category and Status */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {procedure.category && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {procedure.category}
                  </Badge>
                )}
                {procedure.is_global && (
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    Global
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Assigned to you</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStart} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Execution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Full-Screen Execution View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Clean Header with Back Option */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <h2 className="font-semibold text-gray-900">{procedure.title}</h2>
                  <p className="text-sm text-gray-600">Procedure Execution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Content */}
          <div className="flex-1 overflow-hidden">
            <ProcedureExecution
              procedure={procedure}
              executionId={executionId}
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
