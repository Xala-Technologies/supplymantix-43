import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageFilters, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Download, Sparkles, FileText, Upload } from "lucide-react";
import { 
  useProceduresEnhanced, 
  useDeleteProcedure, 
  useDuplicateProcedure,
  useStartExecution,
  useProcedureTemplates,
  useCreateProcedure, 
  useUpdateProcedure 
} from "@/hooks/useProceduresEnhanced";
import { useProcedureUtils } from "@/hooks/useProcedureUtils";
import { ProcedureTemplateBuilder } from "@/components/procedures/ProcedureTemplateBuilder";
import { ExecutionDialog } from "@/components/procedures/ExecutionDialog";
import { EnhancedProcedureCard } from "@/components/procedures/EnhancedProcedureCard";
import { ProcedureFilters } from "@/components/procedures/ProcedureFilters";
import { ProcedureTemplatesDialog } from "@/components/procedures/ProcedureTemplatesDialog";
import { ProcedureResultsDialog } from "@/components/procedures/ProcedureResultsDialog";
import { ProcedureEmptyState } from "@/components/procedures/ProcedureEmptyState";
import { Card, CardContent } from "@/components/ui/card";
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
  const [showNewProcedureModal, setShowNewProcedureModal] = useState(false);
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

  const { categories, getCategoryColor, canExecuteProcedure, formatAnswerValue } = useProcedureUtils();

  const procedures = proceduresData?.procedures || [];

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

  const handleExecuteProcedure = async (procedure: any) => {
    const { canExecute, reason } = canExecuteProcedure(procedure, executingProcedures);
    
    if (!canExecute) {
      toast.error(reason || "Cannot execute procedure");
      return;
    }

    try {
      setExecutingProcedures(prev => new Set(prev).add(procedure.id));
      setSelectedProcedure(procedure);
      
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
    setExecutionResult({
      answers,
      score,
      procedure: selectedProcedure
    });
    
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

  const handleEditProcedure = (procedure: any) => {
    setSelectedProcedure(procedure);
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm">Loading procedures...</p>
              </div>
            </div>
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 to-white">
        {/* Modern Enhanced Header */}
        <div className="relative border-b border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Procedure Library</h1>
                <p className="text-slate-600 text-base">Create and manage standardized procedures for your team</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{procedures.length} active procedures</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ready to execute</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  onClick={() => setShowNewProcedureModal(true)} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Procedure Template
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-5">
          <ProcedureFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showGlobalOnly={showGlobalOnly}
            setShowGlobalOnly={setShowGlobalOnly}
            categories={categories}
          />
        </div>

        {/* Main Content with Enhanced Design */}
        <div className="flex-1 flex overflow-hidden">
          {/* Modern Sidebar */}
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">My Templates</h2>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {procedures.length} {procedures.length === 1 ? 'template' : 'templates'}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-slate-500">Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : procedures.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-slate-400 mb-4">
                    <FileText className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-slate-900 font-medium mb-2">No procedures found</h3>
                  <p className="text-slate-600 text-sm mb-4">Get started by creating your first procedure</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
                    onClick={() => setShowNewProcedureModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create procedure
                  </Button>
                </div>
              ) : (
                <div className="p-3">
                  {procedures.map((procedure) => (
                    <EnhancedProcedureCard
                      key={procedure.id}
                      procedure={procedure}
                      isSelected={selectedProcedure?.id === procedure.id}
                      onClick={() => setSelectedProcedure(procedure)}
                      onEdit={handleEditProcedure}
                      onDuplicate={handleDuplicateProcedure}
                      onDelete={setDeleteConfirm}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Detail Panel */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 to-white">
            {selectedProcedure ? (
              <div className="h-full flex flex-col">
                {/* Enhanced Procedure Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full transform translate-x-32 -translate-y-32"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full transform -translate-x-16 translate-y-16"></div>
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 max-w-4xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                          <span className="text-blue-100 text-sm font-medium">Active Procedure</span>
                        </div>
                        
                        <h1 className="text-3xl font-bold mb-3 leading-tight">{selectedProcedure.title}</h1>
                        
                        {selectedProcedure.description && (
                          <p className="text-blue-100 text-lg mb-6 leading-relaxed max-w-3xl">
                            {selectedProcedure.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-8 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{selectedProcedure.fields?.length || 0}</div>
                              <div className="text-blue-200 text-xs">Fields</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-semibold">{selectedProcedure.category?.charAt(0) || 'P'}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{selectedProcedure.category}</div>
                              <div className="text-blue-200 text-xs">Category</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProcedure(selectedProcedure)}
                          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tabs */}
                <div className="border-b border-slate-200 bg-white shadow-sm">
                  <div className="px-8">
                    <nav className="-mb-px flex space-x-8">
                      <button className="border-b-2 border-blue-600 py-4 px-1 text-sm font-semibold text-blue-600 transition-colors">
                        Fields & Structure
                      </button>
                      <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors">
                        Settings & Details
                      </button>
                      <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors">
                        Execution History
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Enhanced Fields Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white to-slate-50/50">
                  <div className="space-y-6 max-w-5xl">
                    {selectedProcedure.fields?.map((field, index) => (
                      <div key={field.id || index} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                  #{index + 1}
                                </span>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {field.label}
                                  {field.is_required && <span className="text-red-500 ml-2">*</span>}
                                </h3>
                              </div>
                              {field.options?.helpText && (
                                <p className="text-slate-600 text-sm leading-relaxed">{field.options.helpText}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                                {field.field_type}
                              </span>
                            </div>
                          </div>

                          {/* Enhanced Field Preview */}
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg p-4 border border-slate-200">
                            {field.field_type === 'text' && (
                              <input 
                                type="text" 
                                placeholder="Text input preview"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                                disabled
                              />
                            )}
                            {field.field_type === 'checkbox' && (
                              <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 mr-2" disabled />
                                <span className="text-sm text-gray-700">Checkbox option</span>
                              </label>
                            )}
                            {field.field_type === 'select' && (
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" disabled>
                                <option>Select an option...</option>
                                {field.options?.choices?.map((choice, i) => (
                                  <option key={i}>{choice}</option>
                                ))}
                              </select>
                            )}
                            {field.field_type === 'multiselect' && (
                              <div className="space-y-2">
                                {(field.options?.choices || ['Option 1', 'Option 2']).slice(0, 3).map((choice, i) => (
                                  <label key={i} className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 mr-2" disabled />
                                    <span className="text-sm text-gray-700">{choice}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {field.field_type === 'number' && (
                              <input 
                                type="number" 
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                                disabled
                              />
                            )}
                            {field.field_type === 'date' && (
                              <input 
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                                disabled
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!selectedProcedure.fields || selectedProcedure.fields.length === 0) && (
                      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
                        <div className="text-slate-400 mb-6">
                          <FileText className="h-20 w-20 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No fields configured</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                          This procedure doesn't have any fields yet. Add fields to create an interactive checklist.
                        </p>
                        <Button 
                          onClick={() => handleEditProcedure(selectedProcedure)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Fields
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="text-slate-400 mb-6">
                    <FileText className="h-20 w-20 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Select a procedure</h3>
                  <p className="text-slate-600 mb-6">
                    Choose a procedure from the sidebar to view its details and manage its configuration
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewProcedureModal(true)}
                    className="border-dashed border-slate-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create new procedure
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Procedure Creation Modal */}
      <Dialog open={showNewProcedureModal} onOpenChange={setShowNewProcedureModal}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create a New Procedure Template
            </h2>
            <p className="text-gray-600 mb-8">
              Choose how you'd like to start building your procedure
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300"
                onClick={() => {
                  setShowNewProcedureModal(false);
                  setShowCreateDialog(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Blank Procedure</h3>
                  <p className="text-sm text-gray-600">Start Procedure From Scratch</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-300"
                onClick={() => {
                  setShowNewProcedureModal(false);
                  setShowTemplatesDialog(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Use a Template</h3>
                  <p className="text-sm text-gray-600">Find one in Global Procedure Library</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-300 opacity-75">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Import Forms</h3>
                  <p className="text-sm text-gray-600">Send us your Template to Digitize</p>
                  <p className="text-xs text-gray-400 mt-2">Coming Soon</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <ProcedureTemplatesDialog
        open={showTemplatesDialog}
        onOpenChange={setShowTemplatesDialog}
        templates={templates}
        templatesLoading={templatesLoading}
        onCreateFromTemplate={handleCreateFromTemplate}
        createProcedureLoading={createProcedure.isPending}
      />

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0">
          <ProcedureTemplateBuilder
            onSave={handleCreateProcedure}
            onCancel={() => setShowCreateDialog(false)}
            isLoading={createProcedure.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0">
          {selectedProcedure && (
            <ProcedureTemplateBuilder
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
      <ProcedureResultsDialog
        open={showResultsDialog}
        onOpenChange={setShowResultsDialog}
        executionResult={executionResult}
        formatAnswerValue={formatAnswerValue}
      />

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
