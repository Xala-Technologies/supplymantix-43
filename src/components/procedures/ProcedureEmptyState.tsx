
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";

interface ProcedureEmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
  onCreateProcedure: () => void;
}

export const ProcedureEmptyState: React.FC<ProcedureEmptyStateProps> = ({
  searchTerm,
  selectedCategory,
  onCreateProcedure
}) => {
  return (
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
          <Button onClick={onCreateProcedure}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Procedure
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
