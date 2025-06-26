import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageFilters, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Download, Sparkles, FileText, Upload, Search, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-8 py-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Procedure Library</h1>
              <p className="text-blue-100 text-lg">Create and manage standardized procedures with ease</p>
              <div className="flex items-center gap-6 mt-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">{procedures.length} Active Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Ready to Execute</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowNewProcedureModal(true)} 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold text-lg shadow-lg border-0 hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-3" />
              New Procedure Template
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search procedures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="lg" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
            <div className="flex gap-2">
              {["All", "Safety", "Maintenance", "Inspection", "Training"].map((filter) => (
                <Badge 
                  key={filter}
                  variant={selectedCategory === filter.toLowerCase() ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 transition-colors ${
                    selectedCategory === filter.toLowerCase() 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedCategory(filter.toLowerCase())}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Enhanced Sidebar */}
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Templates</h2>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  {procedures.length}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">
                {procedures.length === 0 ? "No templates yet" : 
                 `${procedures.length} ${procedures.length === 1 ? 'template' : 'templates'} ready to use`}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-3 p-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : procedures.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures yet</h3>
                  <p className="text-gray-600 text-sm mb-6">Create your first procedure template to get started</p>
                  <Button 
                    onClick={() => setShowNewProcedureModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {procedures.map((procedure) => (
                    <EnhancedProcedureCard
                      key={procedure.id}
                      procedure={procedure}
                      isSelected={selectedProcedure?.id === procedure.id}
                      onClick={() => setSelectedProcedure(procedure)}
                      onExecute={handleExecuteProcedure}
                      onEdit={handleEditProcedure}
                      onDuplicate={handleDuplicateProcedure}
                      onDelete={setDeleteConfirm}
                      getCategoryColor={getCategoryColor}
                      executingProcedures={executingProcedures}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Detail Panel */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-white">
            {selectedProcedure ? (
              <div className="h-full flex flex-col">
                {/* Procedure Header with Gradient */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 text-white p-8 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold">{selectedProcedure.title}</h1>
                          <Badge className="bg-blue-500 text-white mt-1">
                            {selectedProcedure.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedProcedure.description && (
                        <p className="text-gray-200 mb-4 text-lg leading-relaxed">
                          {selectedProcedure.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-8 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {selectedProcedure.fields?.length || 0}
                            </div>
                            <div className="text-gray-300 text-xs">Fields</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-white font-medium">Active</div>
                            <div className="text-gray-300 text-xs">Status</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleEditProcedure(selectedProcedure)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                      >
                        Edit Template
                      </Button>
                      <Button
                        onClick={() => handleExecuteProcedure(selectedProcedure)}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      >
                        Execute Procedure
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="border-b border-gray-200 bg-white shadow-sm">
                  <div className="px-8">
                    <nav className="-mb-px flex space-x-8">
                      <button className="border-b-3 border-blue-600 py-4 px-1 text-sm font-semibold text-blue-600 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Fields & Content
                      </button>
                      <button className="border-b-3 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        Details & Settings
                      </button>
                      <button className="border-b-3 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        Execution History
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Enhanced Fields Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white to-gray-50">
                  <div className="space-y-6 max-w-5xl">
                    {selectedProcedure.fields?.map((field, index) => (
                      <Card key={field.id || index} className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {field.label}
                                    {field.is_required && <span className="text-red-500 ml-2">*</span>}
                                  </h3>
                                  <Badge variant="secondary" className="mt-1">
                                    {field.field_type}
                                  </Badge>
                                </div>
                              </div>
                              {field.options?.helpText && (
                                <p className="text-gray-600 ml-11">{field.options.helpText}</p>
                              )}
                            </div>
                          </div>

                          {/* Enhanced Field Preview */}
                          <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-6 border border-gray-200 ml-11">
                            {field.field_type === 'text' && (
                              <input 
                                type="text" 
                                placeholder="Enter text here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled
                              />
                            )}
                            {field.field_type === 'checkbox' && (
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled />
                                <span className="text-gray-700 font-medium">Mark as complete</span>
                              </label>
                            )}
                            {field.field_type === 'select' && (
                              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500" disabled>
                                <option>Select an option...</option>
                                {field.options?.choices?.map((choice, i) => (
                                  <option key={i}>{choice}</option>
                                ))}
                              </select>
                            )}
                            {field.field_type === 'multiselect' && (
                              <div className="space-y-3">
                                {(field.options?.choices || ['Option 1', 'Option 2']).slice(0, 3).map((choice, i) => (
                                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" disabled />
                                    <span className="text-gray-700">{choice}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {field.field_type === 'number' && (
                              <input 
                                type="number" 
                                placeholder="Enter number..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                disabled
                              />
                            )}
                            {field.field_type === 'date' && (
                              <input 
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                disabled
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {(!selectedProcedure.fields || selectedProcedure.fields.length === 0) && (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No fields configured</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          This procedure template doesn't have any fields yet. Add fields to make it interactive and useful.
                        </p>
                        <Button 
                          onClick={() => handleEditProcedure(selectedProcedure)}
                          className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                          size="lg"
                        >
                          <Plus className="h-5 w-5 mr-2" />
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
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Select a procedure template</h3>
                  <p className="text-gray-600 text-lg">
                    Choose a procedure from the sidebar to view its details, fields, and configuration options.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Procedure Creation Modal */}
      <Dialog open={showNewProcedureModal} onOpenChange={setShowNewProcedureModal}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create a New Procedure Template
            </h2>
            <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
              Choose how you'd like to start building your procedure template. You can start from scratch, use an existing template, or import from external forms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400 group"
                onClick={() => {
                  setShowNewProcedureModal(false);
                  setShowCreateDialog(true);
                }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Blank Procedure</h3>
                  <p className="text-gray-600">Start from scratch and build your procedure step by step</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-400 group"
                onClick={() => {
                  setShowNewProcedureModal(false);
                  setShowTemplatesDialog(true);
                }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Use a Template</h3>
                  <p className="text-gray-600">Browse our library of pre-built procedure templates</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-green-400 group opacity-75">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Upload className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Import Forms</h3>
                  <p className="text-gray-600 mb-2">Upload existing forms to digitize automatically</p>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Coming Soon
                  </Badge>
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
            <AlertDialogTitle>Delete Procedure Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this procedure template? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteProcedure(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Procedures;
