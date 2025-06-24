
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
  FileText,
  AlertCircle,
  Loader2,
  Download,
  Square,
  Activity
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  useProceduresEnhanced, 
  useDeleteProcedure, 
  useDuplicateProcedure,
  useStartExecution,
  useProcedureTemplates
} from "@/hooks/useProceduresEnhanced";
import { ProcedureFormBuilder } from "@/components/procedures/ProcedureFormBuilder";
import { ProcedureExecution } from "@/components/procedures/ProcedureExecution";
import { ExecutionDialog } from "@/components/procedures/ExecutionDialog";
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
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [executingProcedures, setExecutingProcedures] = useState<Set<string>>(new Set());

  const { data: proceduresData, isLoading } = useProceduresEnhanced({
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    is_global: showGlobalOnly || undefined
  });

  const { data: templates, isLoading: templatesLoading } = useProcedureTemplates();

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

  const handleCreateFromTemplate = (template: any) => {
    const templateData = template.template_data;
    
    createProcedure.mutate({
      title: `${templateData.title} (From Template)`,
      description: templateData.description,
      category: templateData.category,
      tags: templateData.tags || [],
      is_global: false,
      fields: templateData.fields || []
    }, {
      onSuccess: () => {
        setShowTemplatesDialog(false);
        toast.success(`Procedure created from template: ${template.name}`);
      }
    });
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

  const canExecuteProcedure = (procedure: any): { canExecute: boolean; reason?: string } => {
    if (!procedure.fields || procedure.fields.length === 0) {
      return { canExecute: false, reason: "No fields configured" };
    }
    if (executingProcedures.has(procedure.id)) {
      return { canExecute: false, reason: "Currently executing" };
    }
    return { canExecute: true };
  };

  const handleExecuteProcedure = async (procedure: any) => {
    const { canExecute, reason } = canExecuteProcedure(procedure);
    
    if (!canExecute) {
      toast.error(reason || "Cannot execute procedure");
      return;
    }

    try {
      setExecutingProcedures(prev => new Set(prev).add(procedure.id));
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
    } finally {
      setExecutingProcedures(prev => {
        const newSet = new Set(prev);
        newSet.delete(procedure.id);
        return newSet;
      });
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

  const renderExecuteButton = (procedure: any, variant: 'primary' | 'secondary' = 'primary') => {
    const { canExecute, reason } = canExecuteProcedure(procedure);
    const isExecuting = executingProcedures.has(procedure.id);
    
    if (variant === 'primary') {
      return (
        <Button 
          size="sm" 
          className={`flex-1 transition-all duration-300 transform hover:scale-105 ${
            canExecute 
              ? 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-md' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
          }`}
          onClick={() => handleExecuteProcedure(procedure)}
          disabled={!canExecute || isExecuting}
          title={!canExecute ? reason : 'Execute this procedure'}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Starting...
            </>
          ) : !canExecute ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              {reason === "No fields configured" ? "No Fields" : "Cannot Execute"}
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <Play className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-semibold">Execute</span>
              </div>
            </>
          )}
        </Button>
      );
    }

    // Secondary button for dropdown menu
    return (
      <DropdownMenuItem 
        onClick={() => handleExecuteProcedure(procedure)}
        disabled={!canExecute || isExecuting}
        className={`${!canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Execute
          </>
        )}
      </DropdownMenuItem>
    );
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
            <Button 
              variant="outline" 
              onClick={() => setShowTemplatesDialog(true)}
              disabled={templatesLoading}
            >
              <Download className="h-4 w-4 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {procedures.map((procedure) => (
                <div key={procedure.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                          {procedure.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {procedure.description}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                          {renderExecuteButton(procedure, 'secondary')}
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

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getCategoryColor(procedure.category || 'Other')} text-xs`}>
                          {procedure.category}
                        </Badge>
                        {procedure.is_global && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Global
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {procedure.fields?.length || 0} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          {procedure.executions_count || 0} runs
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {renderExecuteButton(procedure, 'primary')}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProcedure(procedure);
                          setShowEditDialog(true);
                        }}
                        className="px-4 hover:bg-gray-50 hover:border-gray-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import from Templates</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {templatesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading templates...</p>
              </div>
            ) : !templates || templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
                <p className="text-gray-600">Create procedures first to save them as templates</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex items-center gap-2">
                            {template.tags && template.tags.length > 0 && (
                              <div className="flex gap-1">
                                {template.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {template.is_public && (
                              <Badge variant="outline" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleCreateFromTemplate(template)}
                          disabled={createProcedure.isPending}
                        >
                          {createProcedure.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              Import
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Enhanced Execution Dialog */}
      <ExecutionDialog
        open={showExecutionDialog}
        onOpenChange={setShowExecutionDialog}
        procedure={selectedProcedure}
        executionId={currentExecutionId || undefined}
        onComplete={handleExecutionComplete}
        onCancel={handleExecutionCancel}
      />

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
