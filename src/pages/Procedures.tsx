
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
  useProcedureTemplates,
  useCreateProcedure
} from "@/hooks/useProceduresEnhanced";
import { useProcedureUtils } from "@/hooks/useProcedureUtils";
import { ProcedureCreationWizard } from "@/components/procedures/ProcedureCreationWizard";
import { ProcedureFilters } from "@/components/procedures/ProcedureFilters";
import { ProcedureTemplatesDialog } from "@/components/procedures/ProcedureTemplatesDialog";
import { ProcedureViewToggle } from "@/components/procedures/ProcedureViewToggle";
import { ProcedureCardView } from "@/components/procedures/ProcedureCardView";
import { ProcedureListView } from "@/components/procedures/ProcedureListView";
import { ProcedureDetailDialog } from "@/components/procedures/ProcedureDetailDialog";
import { CategorySidebar } from "@/components/categories/CategorySidebar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Procedures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showGlobalOnly, setShowGlobalOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showNewProcedureModal, setShowNewProcedureModal] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: proceduresData, isLoading } = useProceduresEnhanced({
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    is_global: showGlobalOnly || undefined
  });

  const { data: templates, isLoading: templatesLoading } = useProcedureTemplates();

  const createProcedure = useCreateProcedure();
  const deleteProcedure = useDeleteProcedure();
  const duplicateProcedure = useDuplicateProcedure();

  const { categories, getCategoryColor } = useProcedureUtils();

  const procedures = proceduresData?.procedures || [];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
        setShowCreateWizard(false);
      }
    });
  };

  const handleDeleteProcedure = (id: string) => {
    deleteProcedure.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        setShowDetailDialog(false);
      }
    });
  };

  const handleDuplicateProcedure = (id: string) => {
    duplicateProcedure.mutate({ id });
  };

  const handleEditProcedure = (procedure: any) => {
    console.log('Updating procedure:', procedure);
  };

  const handleOpenInNewWindow = (procedure: any) => {
    console.log('Opening procedure:', procedure);
  };

  const handleViewDetails = (procedure: any) => {
    setSelectedProcedure(procedure);
    setShowDetailDialog(true);
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
      <StandardPageLayout>
        <StandardPageHeader 
          title="Procedures"
          description={`${procedures.length} ${procedures.length === 1 ? 'procedure' : 'procedures'} available`}
        >
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowNewProcedureModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Procedure
            </Button>
          </div>
        </StandardPageHeader>

        <StandardPageFilters>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
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
            <ProcedureViewToggle
              view={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </StandardPageFilters>

        <StandardPageContent>
          <div className="flex gap-6">
            <CategorySidebar
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            
            <div className="flex-1">
              {procedures.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-6">
                    <FileText className="h-20 w-20 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No procedures found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchTerm || selectedCategory !== 'all' || showGlobalOnly || selectedCategories.length > 0
                      ? "No procedures match your current filters. Try adjusting your search criteria."
                      : "Get started by creating your first procedure template."
                    }
                  </p>
                  {!searchTerm && selectedCategory === 'all' && !showGlobalOnly && selectedCategories.length === 0 && (
                    <Button onClick={() => setShowNewProcedureModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Procedure
                    </Button>
                  )}
                </div>
              ) : viewMode === 'card' ? (
                <ProcedureCardView
                  procedures={procedures}
                  onEdit={handleEditProcedure}
                  onDuplicate={handleDuplicateProcedure}
                  onDelete={setDeleteConfirm}
                  onOpenInNewWindow={handleOpenInNewWindow}
                  onViewDetails={handleViewDetails}
                  getCategoryColor={getCategoryColor}
                />
              ) : (
                <ProcedureListView
                  procedures={procedures}
                  onEdit={handleEditProcedure}
                  onDuplicate={handleDuplicateProcedure}
                  onDelete={setDeleteConfirm}
                  onOpenInNewWindow={handleOpenInNewWindow}
                  onViewDetails={handleViewDetails}
                  getCategoryColor={getCategoryColor}
                />
              )}
            </div>
          </div>
        </StandardPageContent>
      </StandardPageLayout>

      {/* New Procedure Creation Modal */}
      <Dialog open={showNewProcedureModal} onOpenChange={setShowNewProcedureModal}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create a New Procedure
            </h2>
            <p className="text-gray-600 mb-8">
              Choose how you'd like to start building your procedure
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300"
                onClick={() => {
                  setShowNewProcedureModal(false);
                  setShowCreateWizard(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Blank Procedure</h3>
                  <p className="text-sm text-gray-600">Start from scratch</p>
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
                  <h3 className="font-medium text-gray-900 mb-2">Use Template</h3>
                  <p className="text-sm text-gray-600">Choose from library</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-not-allowed opacity-50 border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-500 mb-2">Import</h3>
                  <p className="text-sm text-gray-400">Coming soon</p>
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

      {/* Create Wizard */}
      <ProcedureCreationWizard
        open={showCreateWizard}
        onOpenChange={setShowCreateWizard}
        onSave={handleCreateProcedure}
        isLoading={createProcedure.isPending}
      />

      {/* Procedure Details Dialog */}
      <ProcedureDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        procedure={selectedProcedure}
        onEdit={handleEditProcedure}
        onDuplicate={handleDuplicateProcedure}
        onDelete={setDeleteConfirm}
        getCategoryColor={getCategoryColor}
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
