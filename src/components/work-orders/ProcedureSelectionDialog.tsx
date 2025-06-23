
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useProceduresEnhanced } from '@/hooks/useProceduresEnhanced';

interface ProcedureSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (procedure: any) => void;
  onCreateNew?: () => void;
  selectedProcedures?: string[];
}

export const ProcedureSelectionDialog: React.FC<ProcedureSelectionDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
  onCreateNew,
  selectedProcedures = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: proceduresData, isLoading } = useProceduresEnhanced({
    search: searchTerm || undefined,
    limit: 50
  });

  const procedures = proceduresData?.procedures || [];

  const handleSelect = (procedure: any) => {
    onSelect(procedure);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Procedure</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search procedures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create New Button */}
          {onCreateNew && (
            <Button onClick={onCreateNew} className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Procedure
            </Button>
          )}

          {/* Procedures List */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading procedures...</p>
            </div>
          ) : procedures.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No procedures found matching your search.' : 'No procedures available.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {procedures.map((procedure) => (
                <Card 
                  key={procedure.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedProcedures.includes(procedure.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelect(procedure)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{procedure.title}</h3>
                      <Badge variant="secondary">{procedure.category || 'General'}</Badge>
                    </div>
                    
                    {procedure.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {procedure.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{procedure.fields?.length || 0} fields</span>
                      <span>{procedure.executions_count || 0} executions</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
