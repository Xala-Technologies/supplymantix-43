
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, FileText, AlertCircle, Settings } from "lucide-react";
import { useProceduresEnhanced } from "@/hooks/useProceduresEnhanced";
import { ExecutionDialog } from "../procedures/ExecutionDialog";
import { ProcedureSelectionDialog } from "./ProcedureSelectionDialog";
import { ProcedureWithFields } from "@/lib/database/procedures-enhanced";

interface WorkOrderProcedureSectionProps {
  workOrderId: string;
  procedures?: any[];
  onProceduresUpdate?: () => void;
}

export const WorkOrderProcedureSection: React.FC<WorkOrderProcedureSectionProps> = ({
  workOrderId,
  procedures = [],
  onProceduresUpdate
}) => {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureWithFields | null>(null);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);
  
  const { data: proceduresData } = useProceduresEnhanced({
    limit: 10
  });

  const availableProcedures = proceduresData?.procedures || [];

  const handleExecuteProcedure = (procedure: ProcedureWithFields) => {
    setSelectedProcedure(procedure);
    setShowExecutionDialog(true);
  };

  const handleExecutionComplete = (answers: any, score: number) => {
    console.log('Procedure execution completed:', { answers, score, workOrderId });
    setShowExecutionDialog(false);
    setSelectedProcedure(null);
    if (onProceduresUpdate) {
      onProceduresUpdate();
    }
  };

  const handleExecutionCancel = () => {
    setShowExecutionDialog(false);
    setSelectedProcedure(null);
  };

  const handleAddProcedure = () => {
    setShowSelectionDialog(true);
  };

  const handleProcedureSelected = (procedure: ProcedureWithFields) => {
    setShowSelectionDialog(false);
    console.log('Adding procedure to work order:', procedure.id, workOrderId);
    if (onProceduresUpdate) {
      onProceduresUpdate();
    }
  };

  if (availableProcedures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Procedures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Procedures</h3>
            <p className="text-gray-600 mb-4">Create procedures first</p>
            <Button variant="outline" onClick={() => window.location.href = '/procedures'}>
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Procedures ({availableProcedures.length})
            </CardTitle>
            <Button onClick={handleAddProcedure} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableProcedures.slice(0, 5).map((procedure) => (
            <div key={procedure.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{procedure.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {procedure.category || 'General'}
                    </Badge>
                  </div>
                  
                  {procedure.description && (
                    <p className="text-sm text-gray-600 mb-3">{procedure.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {procedure.fields?.length || 0} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {procedure.executions_count || 0} runs
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => handleExecuteProcedure(procedure)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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

      {/* Procedure Selection Dialog */}
      <ProcedureSelectionDialog
        open={showSelectionDialog}
        onOpenChange={setShowSelectionDialog}
        onSelect={handleProcedureSelected}
      />
    </>
  );
};
