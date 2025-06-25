
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText } from "lucide-react";

interface ExecutionResult {
  answers: any[];
  score: number;
  procedure: any;
}

interface ProcedureResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  executionResult: ExecutionResult | null;
  formatAnswerValue: (answer: any) => string;
}

export const ProcedureResultsDialog: React.FC<ProcedureResultsDialogProps> = ({
  open,
  onOpenChange,
  executionResult,
  formatAnswerValue
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Procedure Completed
          </DialogTitle>
        </DialogHeader>
        {executionResult && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">{executionResult.procedure.title}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-700">
                  Score: <strong>{executionResult.score}%</strong>
                </span>
                <span className="text-green-700">
                  Fields Completed: <strong>{executionResult.answers.length}</strong>
                </span>
                <span className="text-green-700">
                  Date: <strong>{new Date().toLocaleDateString()}</strong>
                </span>
              </div>
            </div>

            {executionResult.answers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Responses:</h4>
                <div className="space-y-2">
                  {executionResult.answers.map((answer: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">{answer.label}</h5>
                          <p className="text-sm text-gray-600 mt-1">{formatAnswerValue(answer)}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {answer.fieldType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                <FileText className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
