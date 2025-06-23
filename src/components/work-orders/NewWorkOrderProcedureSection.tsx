
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { ProcedureSelectionDialog } from "./ProcedureSelectionDialog";
import { workOrderProcedureService } from "@/lib/workOrderProcedureService";

interface NewWorkOrderProcedureSectionProps {
  selectedProcedures: string[];
  onProcedureAdd: (procedureId: string) => void;
  onProcedureRemove: (procedureId: string) => void;
}

export const NewWorkOrderProcedureSection = ({
  selectedProcedures,
  onProcedureAdd,
  onProcedureRemove,
}: NewWorkOrderProcedureSectionProps) => {
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);

  const handleProcedureSelect = (procedure: any) => {
    onProcedureAdd(procedure.id);
    setShowProcedureDialog(false);
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
        {selectedProcedures.length > 0 ? (
          <div className="space-y-3">
            {selectedProcedures.map((procedureId) => {
              const procedure = getProcedureDetails(procedureId);
              return (
                <div key={procedureId} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {procedure?.title || 'Unknown Procedure'}
                        </h4>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          Template
                        </Badge>
                      </div>
                      
                      {procedure && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{procedure.description}</p>
                          <div className="flex items-center gap-4">
                            <span>⏱️ {procedure.estimatedDuration} min</span>
                            <span>📋 {procedure.steps.length} steps</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onProcedureRemove(procedureId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mb-2">
              📋 No procedures selected yet
            </div>
            <p className="text-sm text-gray-500">
              Add procedures to provide step-by-step guidance for this work order.
            </p>
          </div>
        )}

        <ProcedureSelectionDialog
          open={showProcedureDialog}
          onOpenChange={setShowProcedureDialog}
          onSelect={handleProcedureSelect}
          selectedProcedures={selectedProcedures}
        />
      </CardContent>
    </Card>
  );
};
