
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Play, Pause, X, FileText, Camera, AlertTriangle } from "lucide-react";
import { useProceduresEnhanced, useProcedureExecutions } from "@/hooks/useProceduresEnhanced";
import { ExecutionDialog } from "../procedures/ExecutionDialog";
import { ProcedureWithFields } from "@/lib/database/procedures-enhanced";

interface WorkOrderExecutionProps {
  workOrderId: string;
}

export const WorkOrderExecution = ({ workOrderId }: WorkOrderExecutionProps) => {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureWithFields | null>(null);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  
  const { data: proceduresData } = useProceduresEnhanced({
    limit: 5
  });

  const procedures = proceduresData?.procedures || [];

  const handleExecuteProcedure = (procedure: ProcedureWithFields) => {
    setSelectedProcedure(procedure);
    setShowExecutionDialog(true);
  };

  const handleExecutionComplete = (answers: any, score: number) => {
    console.log('Work order procedure execution completed:', { answers, score, workOrderId });
    setShowExecutionDialog(false);
    setSelectedProcedure(null);
  };

  const handleExecutionCancel = () => {
    setShowExecutionDialog(false);
    setSelectedProcedure(null);
  };

  if (procedures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Procedure Execution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Procedures Available</h3>
            <p className="text-gray-600 mb-4">Create procedures first to execute them with this work order.</p>
            <Button variant="outline" onClick={() => window.location.href = '/procedures'}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Procedures
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              Available Procedures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {procedures.map((procedure) => (
              <div key={procedure.id} className="border rounded-lg p-4">
                {/* Procedure Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{procedure.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{procedure.fields?.length || 0} steps</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~{Math.ceil((procedure.fields?.length || 1) * 1.5)} minutes</span>
                      </div>
                      <Badge variant="secondary">
                        {procedure.category || 'General'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleExecuteProcedure(procedure)}>
                      <Play className="w-4 h-4 mr-2" />
                      Execute
                    </Button>
                  </div>
                </div>

                {/* Procedure Description */}
                {procedure.description && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm">{procedure.description}</p>
                  </div>
                )}

                {/* Procedure Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600">{procedure.fields?.length || 0}</div>
                    <div className="text-xs text-blue-700">Total Steps</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-bold text-green-600">{procedure.executions_count || 0}</div>
                    <div className="text-xs text-green-700">Executions</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-bold text-purple-600">
                      {procedure.is_global ? 'Global' : 'Local'}
                    </div>
                    <div className="text-xs text-purple-700">Scope</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Execution Dialog */}
      {selectedProcedure && (
        <ExecutionDialog
          open={showExecutionDialog}
          onOpenChange={setShowExecutionDialog}
          procedure={selectedProcedure}
          workOrderId={workOrderId}
          onComplete={handleExecutionComplete}
          onCancel={handleExecutionCancel}
        />
      )}
    </>
  );
};
