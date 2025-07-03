import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, Upload } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

interface ProcedureCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFromScratch: () => void;
  onCreateFromTemplate: () => void;
}

export const ProcedureCreationModal: React.FC<ProcedureCreationModalProps> = ({
  open,
  onOpenChange,
  onCreateFromScratch,
  onCreateFromTemplate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <ErrorBoundary>
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
                  onOpenChange(false);
                  onCreateFromScratch();
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
                  onOpenChange(false);
                  onCreateFromTemplate();
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
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};