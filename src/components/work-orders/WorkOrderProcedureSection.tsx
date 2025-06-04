
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { ProcedureSelectionDialog } from "./ProcedureSelectionDialog";
import { useProcedures } from "@/hooks/useProcedures";

interface WorkOrderProcedureSectionProps {
  selectedProcedures: string[];
  onProcedureAdd: (procedureId: string) => void;
  onProcedureRemove: (procedureId: string) => void;
}

export const WorkOrderProcedureSection = ({
  selectedProcedures,
  onProcedureAdd,
  onProcedureRemove,
}: WorkOrderProcedureSectionProps) => {
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);
  const { data: procedures } = useProcedures();

  const handleProcedureSelect = (procedureId: string) => {
    if (!selectedProcedures.includes(procedureId)) {
      onProcedureAdd(procedureId);
    }
    setShowProcedureDialog(false);
  };

  const getSelectedProcedureDetails = (procedureId: string) => {
    return procedures?.find(p => p.id === procedureId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900">Procedure</h3>
      </div>
      
      {selectedProcedures.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedProcedures.map((procedureId) => {
              const procedure = getSelectedProcedureDetails(procedureId);
              return (
                <Badge 
                  key={procedureId} 
                  variant="secondary" 
                  className="flex items-center gap-2 px-3 py-1"
                >
                  {procedure?.title || 'Unknown Procedure'}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => onProcedureRemove(procedureId)}
                  />
                </Badge>
              );
            })}
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            📋 Create or attach new Form, Procedure or Checklist
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowProcedureDialog(true)}
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Procedure
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg text-center">
            📋 Create or attach new Form, Procedure or Checklist
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowProcedureDialog(true)}
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Procedure
          </Button>
        </div>
      )}

      <ProcedureSelectionDialog
        open={showProcedureDialog}
        onOpenChange={setShowProcedureDialog}
        onProcedureSelect={handleProcedureSelect}
        selectedProcedures={selectedProcedures}
      />
    </div>
  );
};
