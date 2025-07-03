import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowLeft, CheckCircle2, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProceduresEnhanced } from "@/hooks/useProceduresEnhanced";

interface ProcedureSelectionDialogEnhancedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProcedure: (procedure: any) => void;
  selectedProcedures: any[];
}

export const ProcedureSelectionDialogEnhanced = ({
  open,
  onOpenChange,
  onSelectProcedure,
  selectedProcedures
}: ProcedureSelectionDialogEnhancedProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: proceduresData = [], isLoading } = useProceduresEnhanced();

  // Handle both array and object response formats
  const procedures = Array.isArray(proceduresData) ? proceduresData : proceduresData.procedures || [];

  const filteredProcedures = procedures.filter((procedure: any) =>
    procedure.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    procedure.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNewProcedure = () => {
    // Store current work order form data and return path
    localStorage.setItem('workOrderReturnPath', '/dashboard/work-orders');
    localStorage.setItem('workOrderReturnAction', 'procedure-created');
    
    // Close dialog and navigate to procedures page
    onOpenChange(false);
    navigate('/dashboard/procedures');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const isProcedureSelected = (procedureId: string) => {
    return selectedProcedures.some(p => p.id === procedureId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold">Add Procedure</DialogTitle>
            </div>
            <Button
              onClick={handleCreateNewProcedure}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create a New Procedure
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Procedure Templates"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600">Loading procedures...</p>
                </div>
              </div>
            ) : filteredProcedures.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProcedures.map((procedure) => (
                    <Card 
                      key={procedure.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isProcedureSelected(procedure.id) 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:border-blue-300'
                      }`}
                      onClick={() => onSelectProcedure(procedure)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <h3 className="font-medium text-gray-900 truncate">
                              {procedure.title}
                            </h3>
                          </div>
                          {isProcedureSelected(procedure.id) && (
                            <Badge className="bg-blue-600 text-white">
                              Selected
                            </Badge>
                          )}
                        </div>
                        
                        {procedure.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {procedure.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            {procedure.steps && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{procedure.steps.length} steps</span>
                              </div>
                            )}
                            {procedure.estimated_duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDuration(procedure.estimated_duration)}</span>
                              </div>
                            )}
                          </div>
                          {procedure.category && (
                            <Badge variant="secondary" className="text-xs">
                              {procedure.category}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-6 px-6 py-12">
                  {/* Illustration */}
                  <div className="relative mx-auto w-48 h-48">
                    <div className="absolute inset-0 bg-blue-50 rounded-2xl transform rotate-3"></div>
                    <div className="absolute inset-2 bg-white rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="w-12 h-2 bg-blue-200 rounded mx-auto"></div>
                          <div className="w-16 h-2 bg-blue-200 rounded mx-auto"></div>
                          <div className="w-10 h-2 bg-blue-200 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Start adding Procedures to your organization
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Press <span className="font-medium text-blue-600">+ Create a New Procedure</span> button above to add your first 
                      Procedure and share it with your organization!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};