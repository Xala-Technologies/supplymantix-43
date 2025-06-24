
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  X, 
  User, 
  MapPin,
  Timer,
  CheckCircle,
  ArrowLeft,
  Clock,
  Award,
  Activity
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
  const [currentView, setCurrentView] = useState<'start' | 'executing'>('start');

  if (!procedure) {
    return null;
  }

  const handleStart = () => {
    setCurrentView('executing');
  };

  const handleComplete = (answers: any, score: number) => {
    onComplete(answers, score);
    setCurrentView('start');
  };

  const handleCancel = () => {
    onCancel();
    setCurrentView('start');
  };

  const handleBack = () => {
    setCurrentView('start');
  };

  // Start View
  if (currentView === 'start') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              Execute Procedure
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Procedure Info */}
            <div className="text-center py-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {procedure.title || 'Untitled Procedure'}
              </h3>
              {procedure.description && (
                <p className="text-gray-600">{procedure.description}</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-blue-900">{procedure.fields?.length || 0}</p>
                  <p className="text-xs text-blue-700">Steps</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3 text-center">
                  <Timer className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-green-900">~{Math.ceil((procedure.fields?.length || 1) * 2)}</p>
                  <p className="text-xs text-green-700">Minutes</p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-3 text-center">
                  <Activity className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-purple-900">{procedure.executions_count || 0}</p>
                  <p className="text-xs text-purple-700">Runs</p>
                </CardContent>
              </Card>
            </div>

            {/* Category & Status */}
            <div className="flex items-center justify-center gap-2">
              {procedure.category && (
                <Badge variant="secondary">{procedure.category}</Badge>
              )}
              {procedure.is_global && (
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  Global
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleStart} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Procedure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Execution View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header with back button */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h3 className="font-semibold text-gray-900">{procedure.title}</h3>
                <p className="text-sm text-gray-600">Live Execution</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
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
