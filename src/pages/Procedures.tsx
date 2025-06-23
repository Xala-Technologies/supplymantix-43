import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  MoreVertical,
  Clock,
  CheckCircle,
  Globe,
  Building,
  FileText
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  useProceduresEnhanced, 
  useDeleteProcedure, 
  useDuplicateProcedure,
  useStartExecution 
} from "@/hooks/useProceduresEnhanced";
import { ProcedureFormBuilder } from "@/components/procedures/ProcedureFormBuilder";
import { ProcedureExecution } from "@/components/procedures/ProcedureExecution";
import { useCreateProcedure, useUpdateProcedure } from "@/hooks/useProceduresEnhanced";
import { toast } from "sonner";

interface ExecutionResult {
  answers: any[];
  score: number;
  procedure: any;
}

const Procedures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showGlobalOnly, setShowGlobalOnly] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: proceduresData, isLoading } = useProceduresEnhanced({
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    is_global: showGlobalOnly || undefined
  });

  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const deleteProcedure = useDeleteProcedure();
  const duplicateProcedure = useDuplicateProcedure();
  const startExecution = useStartExecution();

  const procedures = proceduresData?.procedures || [];

  const categories = [
    "Inspection",
    "Safety", 
    "Calibration",
    "Reactive Maintenance",
    "Preventive Maintenance",
    "Quality Control",
    "Training",
    "Other"
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Inspection": "bg-blue-100 text-blue-700",
      "Safety": "bg-green-100 text-green-700", 
      "Calibration": "bg-purple-100 text-purple-700",
      "Reactive Maintenance": "bg-red-100 text-red-700",
      "Preventive Maintenance": "bg-orange-100 text-orange-700",
      "Quality Control": "bg-indigo-100 text-indigo-700",
      "Training": "bg-yellow-100 text-yellow-700",
      "Other": "bg-gray-100 text-gray-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const handleCreateProcedure = (data: any) => {
    createProcedure.mutate(data, {
      onSuccess: () => {
        setShowCreateDialog(false);
      }
    });
  };

  const handleUpdateProcedure = (data: any) => {
    if (!selectedProcedure) return;
    
    updateProcedure.mutate(
      { id: selectedProcedure.id, updates: data },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelectedProcedure(null);
        }
      }
    );
  };

  const handleDeleteProcedure = (id: string) => {
    deleteProcedure.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
      }
    });
  };

  const handleDuplicateProcedure = (id: string) => {
    duplicateProcedure.mutate({ id });
  };

  const handleExecuteProcedure = async (procedure: any) => {
    try {
      setSelectedProcedure(procedure);
      
      // Start execution in database
      const execution = await startExecution.mutateAsync({ 
        procedureId: procedure.id 
      });
      
      setCurrentExecutionId(execution.id);
      setShowExecutionDialog(true);
    } catch (error) {
      console.error('Failed to start execution:', error);
      toast.error('Failed to start procedure execution');
    }
  };

  const handleExecutionComplete = (answers: any, score: number) => {
    // Store the results
    setExecutionResult({
      answers,
      score,
      procedure: selectedProcedure
    });
    
    // Close execution dialog and show results
    setShowExecutionDialog(false);
    setShowResultsDialog(true);
    setCurrentExecutionId(null);
    
    toast.success(`Procedure completed with ${score}% score!`);
  };

  const handleExecutionCancel = () => {
    setShowExecutionDialog(false);
    setSelectedProcedure(null);
    setCurrentExecutionId(null);
  };

  const formatAnswerValue = (answer: any): string => {
    if (answer.value === null || answer.value === undefined || answer.value === '') {
      return 'Not answered';
    }
    
    switch (answer.fieldType) {
      case 'checkbox':
        return answer.value ? 'Yes' : 'No';
      case 'multiselect':
        return Array.isArray(answer.value) ? answer.value.join(', ') : answer.value;
      case 'file':
        return typeof answer.value === 'object' ? answer.value.name || 'File uploaded' : answer.value;
      case 'date':
        return new Date(answer.value).toLocaleDateString();
      default:
        return String(answer.value);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading procedures...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procedure Library</h1>
            <p className="text-gray-600">Manage standardized procedures and checklists</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              Import Templates
            </Button>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Procedure
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showGlobalOnly ? "default" : "outline"}
                onClick={() => setShowGlobalOnly(!showGlobalOnly)}
                size="sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                Global Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Procedures Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {showGlobalOnly ? 'Global Procedures' : 'My Procedures'} ({procedures.length})
            </h2>
          </div>
          
          {procedures.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Building className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first procedure"}
                </p>
                {!searchTerm && selectedCategory === "all" && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Procedure
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {procedures.map((procedure) => (
                <Card key={procedure.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {procedure.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {procedure.description}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExecuteProcedure(procedure)}>
                            <Play className="h-4 w-4 mr-2" />
                            Execute
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedProcedure(procedure);
                            setShowEditDialog(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateProcedure(procedure.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteConfirm(procedure.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge className={getCategoryColor(procedure.category || 'Other')}>
                          {procedure.category}
                        </Badge>
                        {procedure.is_global && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Globe className="h-3 w-3 mr-1" />
                            Global
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{procedure.fields?.length || 0} fields</span>
                      <span>{procedure.executions_count || 0} executions</span>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleExecuteProcedure(procedure)}
                        disabled={startExecution.isPending}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {startExecution.isPending ? 'Starting...' : 'Execute'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedProcedure(procedure);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-5xl h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Procedure</DialogTitle>
          </DialogHeader>
          <ProcedureFormBuilder
            onSave={handleCreateProcedure}
            onCancel={() => setShowCreateDialog(false)}
            isLoading={createProcedure.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-5xl h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Procedure</DialogTitle>
          </DialogHeader>
          {selectedProcedure && (
            <ProcedureFormBuilder
              initialData={selectedProcedure}
              onSave={handleUpdateProcedure}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedProcedure(null);
              }}
              isLoading={updateProcedure.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Execution Dialog */}
      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="max-w-3xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle>Execute Procedure</DialogTitle>
          </DialogHeader>
          {selectedProcedure && (
            <ProcedureExecution
              procedure={selectedProcedure}
              executionId={currentExecutionId || undefined}
              onComplete={handleExecutionComplete}
              onCancel={handleExecutionCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
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
                <Button variant="outline" onClick={() => setShowResultsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  // Could implement export/print functionality here
                  setShowResultsDialog(false);
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Procedure</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this procedure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteProcedure(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Procedures;
