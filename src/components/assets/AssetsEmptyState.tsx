
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, FileText, BarChart3 } from "lucide-react";

interface AssetsEmptyStateProps {
  onCreateAsset: () => void;
}

export const AssetsEmptyState = ({ onCreateAsset }: AssetsEmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Assets Found
          </h3>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Start managing your assets by creating your first asset. Track equipment, 
            monitor maintenance, and optimize your operations.
          </p>
          
          <div className="space-y-4">
            <Button onClick={onCreateAsset} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Asset
            </Button>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Track Maintenance</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Monitor Performance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
