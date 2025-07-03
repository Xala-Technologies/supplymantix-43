import React from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageFilters, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, Plus } from "lucide-react";
import { ProcedureCreationWizard } from "@/components/procedures/ProcedureCreationWizard";
import { ProcedureFilters } from "@/components/procedures/ProcedureFilters";
import { ProcedureTemplatesDialog } from "@/components/procedures/ProcedureTemplatesDialog";
import { ProcedureViewToggle } from "@/components/procedures/ProcedureViewToggle";
import { ProcedureDetailDialog } from "@/components/procedures/ProcedureDetailDialog";
import { ProcedureCreationModal } from "@/components/procedures/ProcedureCreationModal";
import { ProceduresContent } from "@/components/procedures/ProceduresContent";
import { DataLoadingManager } from "@/components/ui/DataLoadingManager";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useProceduresPage } from "@/hooks/useProceduresPage";

const Procedures = () => {
  const {
    // State
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showGlobalOnly,
    setShowGlobalOnly,
    viewMode,
    setViewMode,
    showCreateWizard,
    setShowCreateWizard,
    showTemplatesDialog,
    setShowTemplatesDialog,
    showNewProcedureModal,
    setShowNewProcedureModal,
    showDetailDialog,
    setShowDetailDialog,
    selectedProcedure,
    deleteConfirm,
    setDeleteConfirm,

    // Data
    procedures,
    templates,
    categories,
    isLoading,
    error,
    templatesLoading,
    refetch,

    // Mutations
    createProcedure,

    // Handlers
    handleCreateFromTemplate,
    handleCreateProcedure,
    handleDeleteProcedure,
    handleDuplicateProcedure,
    handleEditProcedure,
    handleOpenInNewWindow,
    handleViewDetails,
    getCategoryColor
  } = useProceduresPage();

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <StandardPageLayout>
          <DataLoadingManager
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            loadingText="Loading procedures..."
            errorText="Failed to load procedures"
          >
            <StandardPageHeader 
              title="Procedures"
              description={`${procedures.length} ${procedures.length === 1 ? 'procedure' : 'procedures'} available`}
            >
              <div className="flex items-center gap-3">
                <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setShowNewProcedureModal(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
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
              <ProceduresContent
                procedures={procedures}
                viewMode={viewMode}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                showGlobalOnly={showGlobalOnly}
                onEdit={handleEditProcedure}
                onDuplicate={handleDuplicateProcedure}
                onDelete={setDeleteConfirm}
                onOpenInNewWindow={handleOpenInNewWindow}
                onViewDetails={handleViewDetails}
                onCreateProcedure={() => setShowNewProcedureModal(true)}
                getCategoryColor={getCategoryColor}
              />
            </StandardPageContent>
          </DataLoadingManager>
        </StandardPageLayout>

        {/* Modals and Dialogs with Error Boundaries */}
        <ProcedureCreationModal
          open={showNewProcedureModal}
          onOpenChange={setShowNewProcedureModal}
          onCreateFromScratch={() => setShowCreateWizard(true)}
          onCreateFromTemplate={() => setShowTemplatesDialog(true)}
        />

        <ErrorBoundary>
          <ProcedureTemplatesDialog
            open={showTemplatesDialog}
            onOpenChange={setShowTemplatesDialog}
            templates={templates}
            templatesLoading={templatesLoading}
            onCreateFromTemplate={handleCreateFromTemplate}
            createProcedureLoading={createProcedure.isPending}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <ProcedureCreationWizard
            open={showCreateWizard}
            onOpenChange={setShowCreateWizard}
            onSave={handleCreateProcedure}
            isLoading={createProcedure.isPending}
          />
        </ErrorBoundary>

        {selectedProcedure && (
          <ErrorBoundary>
            <ProcedureDetailDialog
              open={showDetailDialog}
              onOpenChange={setShowDetailDialog}
              procedure={selectedProcedure}
              onEdit={handleEditProcedure}
              onDuplicate={handleDuplicateProcedure}
              onDelete={setDeleteConfirm}
              getCategoryColor={getCategoryColor}
            />
          </ErrorBoundary>
        )}

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
    </ErrorBoundary>
  );
};

export default Procedures;
