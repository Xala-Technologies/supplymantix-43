
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
  X,
  Target,
  BarChart3
} from "lucide-react";
import { ProcedureExecution } from "./ProcedureExecution";
import { ProcedureWithFields } from "@/lib/database/procedures-enhanced";
import { useStartExecution } from "@/hooks/useProceduresEnhanced";

interface ExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: ProcedureWithFields;
  onComplete: (answers: any, score: number) => void;
  onCancel: () => void;
  workOrderId?: string;
  executionId?: string;
}

export const ExecutionDialog: React.FC<ExecutionDialogProps> = ({
  open,
  onOpenChange,
  procedure,
  onComplete,
  onCancel,
  workOrderId,
  executionId: providedExecutionId
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionId, setExecutionId] = useState<string | undefined>(providedExecutionId);
  
  const startExecution = useStartExecution();

  if (!procedure) {
    return null;
  }

  const handleStart = async () => {
    try {
      const execution = await startExecution.mutateAsync({
        procedureId: procedure.id,
        workOrderId
      });
      setExecutionId(execution.id);
      setIsExecuting(true);
    } catch (error) {
      console.error('Failed to start execution:', error);
    }
  };

  const handleComplete = (answers: any, score: number) => {
    setIsExecuting(false);
    onComplete(answers, score);
  };

  const handleCancel = () => {
    setIsExecuting(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        {!isExecuting ? (
          // Enhanced Start Screen
          <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Compact Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{procedure.title}</h2>
                  <p className="text-sm text-gray-600">Ready to execute procedure</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="hover:bg-red-50">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content - More Compact */}
            <div className="flex-1 p-6">
              {/* Description */}
              {procedure.description && (
                <div className="mb-6 p-4 bg-white/60 rounded-lg border border-blue-100">
                  <p className="text-gray-700">{procedure.description}</p>
                </div>
              )}

              {/* Stats Cards - Horizontal Layout */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="border-blue-200 bg-white/70 hover:bg-white/90 transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl text-gray-900">{procedure.fields?.length || 0}</p>
                    <p className="text-sm text-gray-600">Steps</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-white/70 hover:bg-white/90 transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl text-gray-900">~{Math.ceil((procedure.fields?.length || 1) * 1.5)}</p>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-white/70 hover:bg-white/90 transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl text-gray-900">{procedure.executions_count || 0}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-white/70 hover:bg-white/90 transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl text-gray-900">95%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Info Section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-white/70 border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Procedure Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <Badge variant="secondary" className="text-xs">
                          {procedure.category || 'General'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Scope:</span>
                        <Badge variant={procedure.is_global ? "default" : "outline"} className="text-xs">
                          {procedure.is_global ? 'Global' : 'Local'}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fields:</span>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">{procedure.fields?.length || 0} steps</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What to Expect</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Step-by-step guided execution</li>
                      <li>• Auto-save your progress</li>
                      <li>• Review before submission</li>
                      <li>• Generate completion report</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStart} 
                  disabled={startExecution.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startExecution.isPending ? 'Starting...' : 'Start Execution'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Execution View
          <ProcedureExecution
            procedure={procedure}
            executionId={executionId}
            workOrderId={workOrderId}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
