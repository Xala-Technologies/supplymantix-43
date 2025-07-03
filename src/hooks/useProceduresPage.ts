import React, { useState } from "react";
import { toast } from "sonner";
import { 
  useProceduresEnhanced, 
  useDeleteProcedure, 
  useDuplicateProcedure,
  useProcedureTemplates,
  useCreateProcedure
} from "@/hooks/useProceduresEnhanced";
import { useProcedureUtils } from "@/hooks/useProcedureUtils";

export const useProceduresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showGlobalOnly, setShowGlobalOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showNewProcedureModal, setShowNewProcedureModal] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Enhanced query parameters with proper undefined handling
  const queryParams = React.useMemo(() => ({
    search: searchTerm || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    is_global: showGlobalOnly || undefined
  }), [searchTerm, selectedCategory, showGlobalOnly]);

  const { data: proceduresData, isLoading, error, refetch } = useProceduresEnhanced(queryParams);
  const { data: templates, isLoading: templatesLoading } = useProcedureTemplates();

  const createProcedure = useCreateProcedure();
  const deleteProcedure = useDeleteProcedure();
  const duplicateProcedure = useDuplicateProcedure();

  const { categories, getCategoryColor } = useProcedureUtils();

  // Safe data processing with comprehensive error handling and sorting by updated_at
  const procedures = React.useMemo(() => {
    if (!proceduresData?.procedures) {
      return [];
    }
    
    try {
      const processedProcedures = proceduresData.procedures.map((proc: any) => {
        // Ensure all required properties exist with safe defaults
        return {
          ...proc,
          fields: Array.isArray(proc.procedure_fields) ? proc.procedure_fields : 
                  Array.isArray(proc.fields) ? proc.fields : [],
          executions_count: proc.executions_count || proc.execution_count || 0,
          tags: Array.isArray(proc.tags) ? proc.tags : [],
          category: proc.category || 'Other',
          is_global: Boolean(proc.is_global),
          title: proc.title || 'Untitled Procedure',
          description: proc.description || '',
          updated_at: proc.updated_at || proc.created_at || new Date().toISOString()
        };
      });

      // Sort by updated_at descending (most recently updated first)
      return processedProcedures.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (processingError) {
      console.error('Error processing procedures data:', processingError);
      return [];
    }
  }, [proceduresData]);

  const handleCreateFromTemplate = React.useCallback((template: any) => {
    if (!template?.template_data) {
      toast.error('Invalid template data');
      return;
    }

    const templateData = template.template_data;
    
    createProcedure.mutate({
      title: `${templateData.title || 'New Procedure'} (From Template)`,
      description: templateData.description || '',
      category: templateData.category || 'Other',
      tags: Array.isArray(templateData.tags) ? templateData.tags : [],
      is_global: false,
      fields: Array.isArray(templateData.fields) ? templateData.fields : []
    }, {
      onSuccess: () => {
        setShowTemplatesDialog(false);
        toast.success(`Procedure created from template: ${template.name}`);
      }
    });
  }, [createProcedure]);

  const handleCreateProcedure = React.useCallback((data: any) => {
    createProcedure.mutate(data, {
      onSuccess: () => {
        setShowCreateWizard(false);
      }
    });
  }, [createProcedure]);

  const handleDeleteProcedure = React.useCallback((id: string) => {
    deleteProcedure.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        setShowDetailDialog(false);
      }
    });
  }, [deleteProcedure]);

  const handleDuplicateProcedure = React.useCallback((id: string) => {
    duplicateProcedure.mutate({ id });
  }, [duplicateProcedure]);

  const handleEditProcedure = React.useCallback((procedure: any) => {
    console.log('Updating procedure:', procedure);
    // The edit is handled within the dialog itself
  }, []);

  const handleOpenInNewWindow = React.useCallback((procedure: any) => {
    console.log('Opening procedure:', procedure);
  }, []);

  const handleViewDetails = React.useCallback((procedure: any) => {
    if (!procedure) {
      toast.error('Invalid procedure data');
      return;
    }
    setSelectedProcedure(procedure);
    setShowDetailDialog(true);
  }, []);

  return {
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
    setSelectedProcedure,
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
  };
};