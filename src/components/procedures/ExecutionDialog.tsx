
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  X, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  AlertCircle
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
        <DialogContent className="max-w-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Ready to Execute
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              You're about to start the procedure execution
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Procedure Info Card */}
            <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {procedure.title}
                  </h3>
                  {procedure.description && (
                    <p className="text-gray-600 mb-4">{procedure.description}</p>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {procedure.category && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {procedure.category}
                      </Badge>
                    )}
                    {procedure.is_global && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        Global
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{procedure.fields?.length || 0}</p>
                  <p className="text-sm text-gray-600">Steps</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">~{Math.ceil((procedure.fields?.length || 1) * 2)}</p>
                  <p className="text-sm text-gray-600">Minutes</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{procedure.executions_count || 0}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStart} 
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Execution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Clean Execution View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full bg-gray-50">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{procedure.title}</h2>
                  <p className="text-sm text-gray-600">Live Execution</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Execution Content */}
          <div className="flex-1 overflow-hidden bg-white">
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
