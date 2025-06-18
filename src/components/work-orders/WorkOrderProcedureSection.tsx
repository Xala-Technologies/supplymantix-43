
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { ProcedureSelectionDialog } from "./ProcedureSelectionDialog";
import { useProcedures } from "@/hooks/useProcedures";
import { workOrderProcedureService } from "@/lib/workOrderProcedureService";

interface WorkOrderProcedureSectionProps {
  workOrderId: string;
}

export const WorkOrderProcedureSection = ({
  workOrderId,
}: WorkOrderProcedureSectionProps) => {
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);
  const { data: procedures } = useProcedures();
  
  // Get linked procedures for this work order
  const linkedProcedures = workOrderProcedureService.getLinkedProcedures(workOrderId);
  
  const handleProcedureSelect = (procedureId: string) => {
    // In a real app, this would make an API call to link the procedure
    console.log('Linking procedure', procedureId, 'to work order', workOrderId);
    setShowProcedureDialog(false);
  };

  const handleProcedureRemove = (procedureId: string) => {
    // In a real app, this would make an API call to unlink the procedure
    console.log('Unlinking procedure', procedureId, 'from work order', workOrderId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'not_started':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProcedureDetails = (procedureId: string) => {
    return workOrderProcedureService.sampleProcedures.find(p => p.id === procedureId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Procedures</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowProcedureDialog(true)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Procedure
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {linkedProcedures.length > 0 ? (
          <div className="space-y-4">
            {linkedProcedures.map((link) => {
              const procedure = getProcedureDetails(link.procedureId);
              return (
                <div key={link.procedureId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(link.status)}
                        <h4 className="font-medium text-gray-900">
                          {procedure?.title || 'Unknown Procedure'}
                        </h4>
                        <Badge className={`border ${getStatusColor(link.status)}`}>
                          {link.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {procedure && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{procedure.description}</p>
                          <div className="flex items-center gap-4">
                            <span>⏱️ {procedure.estimatedDuration} min</span>
                            <span>📋 {procedure.steps.length} steps</span>
                            {link.assignedTo && <span>👤 {link.assignedTo}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProcedureRemove(link.procedureId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {link.status === 'in_progress' && link.startedAt && (
                    <div className="text-xs text-gray-500">
                      Started: {new Date(link.startedAt).toLocaleString()}
                    </div>
                  )}
                  
                  {link.status === 'completed' && link.completedAt && (
                    <div className="text-xs text-gray-500">
                      Completed: {new Date(link.completedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mb-4">
              📋 No procedures linked to this work order yet
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Link procedures to provide step-by-step guidance for completing this work order.
            </p>
          </div>
        )}

        <ProcedureSelectionDialog
          open={showProcedureDialog}
          onOpenChange={setShowProcedureDialog}
          onProcedureSelect={handleProcedureSelect}
          selectedProcedures={linkedProcedures.map(link => link.procedureId)}
        />
      </CardContent>
    </Card>
  );
};
