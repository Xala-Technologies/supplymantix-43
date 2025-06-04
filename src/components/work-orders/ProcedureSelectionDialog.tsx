
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useProcedures } from "@/hooks/useProcedures";
import { ProcedureSearchInput } from "./procedure-selection/ProcedureSearchInput";
import { ProcedureList } from "./procedure-selection/ProcedureList";
import { CreateProcedureForm } from "./procedure-selection/CreateProcedureForm";

interface ProcedureSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcedureSelect: (procedureId: string) => void;
  selectedProcedures: string[];
}

export const ProcedureSelectionDialog = ({
  open,
  onOpenChange,
  onProcedureSelect,
  selectedProcedures,
}: ProcedureSelectionDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: procedures = [], isLoading } = useProcedures();

  const handleProcedureCreated = (procedureId: string) => {
    onProcedureSelect(procedureId);
    setShowCreateForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {showCreateForm ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Create a New Procedure
              </>
            ) : (
              <>
                Add Procedure
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="ml-auto text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create a New Procedure
                </Button>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {showCreateForm ? (
          <CreateProcedureForm
            onProcedureCreated={handleProcedureCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="space-y-4">
            <ProcedureSearchInput
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {isLoading ? "Loading procedures..." : `All Templates (${procedures.length})`}
              </h3>
              <ProcedureList
                procedures={procedures}
                selectedProcedures={selectedProcedures}
                onProcedureSelect={onProcedureSelect}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
