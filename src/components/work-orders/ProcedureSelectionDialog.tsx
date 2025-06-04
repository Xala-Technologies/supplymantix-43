
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useProcedures, useCreateProcedure } from "@/hooks/useProcedures";
import { supabase } from "@/integrations/supabase/client";
import { workOrderProcedureService } from "@/lib/workOrderProcedureService";

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
  const [newProcedureTitle, setNewProcedureTitle] = useState("");
  const [newProcedureDescription, setNewProcedureDescription] = useState("");
  
  const { data: procedures } = useProcedures();
  const createProcedure = useCreateProcedure();

  const handleCreateNewProcedure = async () => {
    if (!newProcedureTitle.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) return;

      const newProcedure = await createProcedure.mutateAsync({
        title: newProcedureTitle,
        description: newProcedureDescription,
        tenant_id: userData.tenant_id,
        created_by: user.id,
        estimated_duration: 30,
        steps: [],
      });

      onProcedureSelect(newProcedure.id);
      setNewProcedureTitle("");
      setNewProcedureDescription("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating procedure:", error);
    }
  };

  const allProcedures = [
    ...(procedures || []),
    ...workOrderProcedureService.sampleProcedures,
  ];

  const filteredProcedures = allProcedures.filter(procedure =>
    procedure.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProcedureIcon = (title: string) => {
    if (title.toLowerCase().includes('compressor')) return '🔧';
    if (title.toLowerCase().includes('scale')) return '⚖️';
    if (title.toLowerCase().includes('fire')) return '🧯';
    if (title.toLowerCase().includes('forklift')) return '🚛';
    if (title.toLowerCase().includes('safety')) return '👷';
    return '📋';
  };

  const getProcedureFieldCount = (procedure: any) => {
    if (procedure.steps && Array.isArray(procedure.steps)) {
      return `${procedure.steps.length} fields`;
    }
    // For sample procedures
    if (procedure.steps && procedure.steps.length) {
      return `${procedure.steps.length} fields`;
    }
    return '1 field';
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
          <div className="space-y-4">
            <Input
              placeholder="Procedure title"
              value={newProcedureTitle}
              onChange={(e) => setNewProcedureTitle(e.target.value)}
            />
            <textarea
              placeholder="Procedure description"
              value={newProcedureDescription}
              onChange={(e) => setNewProcedureDescription(e.target.value)}
              className="w-full p-3 border rounded-md min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateNewProcedure}
                disabled={!newProcedureTitle.trim() || createProcedure.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createProcedure.isPending ? "Creating..." : "Add Procedure"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search Procedure Templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">All Templates</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProcedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onProcedureSelect(procedure.id)}
                  >
                    <div className="text-2xl">{getProcedureIcon(procedure.title)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{procedure.title}</h4>
                      <p className="text-sm text-gray-500">{getProcedureFieldCount(procedure)}</p>
                    </div>
                    {selectedProcedures.includes(procedure.id) && (
                      <Badge variant="secondary">Added</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
