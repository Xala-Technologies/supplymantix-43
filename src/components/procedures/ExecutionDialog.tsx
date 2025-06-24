
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  X, 
  User, 
  MapPin,
  Timer,
  CheckCircle
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

  if (!isExecuting) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Execute Procedure
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">
                {procedure.title || 'Untitled Procedure'}
              </h3>
              {procedure.description && (
                <p className="text-sm text-gray-600 mb-4">{procedure.description}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 py-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{procedure.fields?.length || 0} steps</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span>~{Math.ceil((procedure.fields?.length || 1) * 2)} min</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleStart} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
        <ProcedureExecution
          procedure={procedure}
          executionId={executionId}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
