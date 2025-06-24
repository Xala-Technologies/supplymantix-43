
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  CheckCircle,
  X,
  FileText
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
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
        {!isExecuting ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">{procedure.title}</h2>
                  <p className="text-sm text-gray-600">Ready to execute</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {procedure.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{procedure.description}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl">{procedure.fields?.length || 0}</p>
                    <p className="text-sm text-gray-600">Steps</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-2xl">{procedure.executions_count || 0}</p>
                    <p className="text-sm text-gray-600">Runs</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                      {procedure.category || 'General'}
                    </Badge>
                    <p className="text-sm text-gray-600">Category</p>
                  </CardContent>
                </Card>
              </div>

              {/* Info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">What to expect:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Step-by-step execution</li>
                    <li>• Auto-save progress</li>
                    <li>• Review before completion</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleStart} 
                  disabled={startExecution.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startExecution.isPending ? 'Starting...' : 'Start'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
