import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface ProceduresEmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
  showGlobalOnly: boolean;
  onCreateProcedure: () => void;
}

export const ProceduresEmptyState: React.FC<ProceduresEmptyStateProps> = ({
  searchTerm,
  selectedCategory,
  showGlobalOnly,
  onCreateProcedure
}) => {
  const hasFilters = searchTerm || selectedCategory !== 'all' || showGlobalOnly;

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center py-16">
        <div className="text-gray-400 mb-6">
          <FileText className="h-20 w-20 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No procedures found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {hasFilters
            ? "No procedures match your current filters. Try adjusting your search criteria."
            : "Get started by creating your first procedure template."
          }
        </p>
        {!hasFilters && (
          <Button onClick={onCreateProcedure} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Procedure
          </Button>
        )}
      </div>
    </div>
  );
};