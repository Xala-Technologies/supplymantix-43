import React from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ProcedureCardView } from "./ProcedureCardView";
import { ProcedureListView } from "./ProcedureListView";
import { ProceduresEmptyState } from "./ProceduresEmptyState";

interface ProceduresContentProps {
  procedures: any[];
  viewMode: 'card' | 'list';
  searchTerm: string;
  selectedCategory: string;
  showGlobalOnly: boolean;
  onEdit: (procedure: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenInNewWindow: (procedure: any) => void;
  onViewDetails: (procedure: any) => void;
  onCreateProcedure: () => void;
  getCategoryColor: (category: string) => string;
}

export const ProceduresContent: React.FC<ProceduresContentProps> = ({
  procedures,
  viewMode,
  searchTerm,
  selectedCategory,
  showGlobalOnly,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenInNewWindow,
  onViewDetails,
  onCreateProcedure,
  getCategoryColor
}) => {
  if (procedures.length === 0) {
    return (
      <ProceduresEmptyState
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        showGlobalOnly={showGlobalOnly}
        onCreateProcedure={onCreateProcedure}
      />
    );
  }

  if (viewMode === 'card') {
    return (
      <ErrorBoundary fallback={<div className="text-center py-8 text-red-600">Error loading procedure cards</div>}>
        <ProcedureCardView
          procedures={procedures}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onOpenInNewWindow={onOpenInNewWindow}
          onViewDetails={onViewDetails}
          getCategoryColor={getCategoryColor}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="text-center py-8 text-red-600">Error loading procedure list</div>}>
      <ProcedureListView
        procedures={procedures}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onOpenInNewWindow={onOpenInNewWindow}
        onViewDetails={onViewDetails}
        getCategoryColor={getCategoryColor}
      />
    </ErrorBoundary>
  );
};