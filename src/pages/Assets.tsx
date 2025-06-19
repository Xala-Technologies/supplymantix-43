
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { AssetsHeader } from "@/components/assets/AssetsHeader";
import { AssetsList } from "@/components/assets/AssetsList";
import { AssetDetailCard } from "@/components/assets/AssetDetailCard";
import { AssetForm } from "@/components/assets/AssetForm";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset, type Asset } from "@/hooks/useAssets";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState({
    search: "",
    status: [] as string[],
    category: [] as string[],
    location: [] as string[],
    criticality: [] as string[]
  });

  // API hooks
  const { data: assets = [], isLoading } = useAssets(filters);
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const deleteAsset = useDeleteAsset();

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('detail');
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setViewMode('create');
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('edit');
  };

  const handleDeleteAsset = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      deleteAsset.mutate(asset.id);
      if (selectedAsset?.id === asset.id) {
        setViewMode('list');
        setSelectedAsset(null);
      }
    }
  };

  const handleFormSubmit = (data: any) => {
    if (viewMode === 'create') {
      createAsset.mutate(data, {
        onSuccess: () => {
          setViewMode('list');
        }
      });
    } else if (viewMode === 'edit' && selectedAsset) {
      updateAsset.mutate({ id: selectedAsset.id, updates: data }, {
        onSuccess: (updatedAsset) => {
          setSelectedAsset(updatedAsset);
          setViewMode('detail');
        }
      });
    }
  };

  const handleFormCancel = () => {
    if (selectedAsset && (viewMode === 'edit')) {
      setViewMode('detail');
    } else {
      setViewMode('list');
      setSelectedAsset(null);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedAsset(null);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assets...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        {(viewMode === 'create' || viewMode === 'edit') ? (
          // Form View
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={handleFormCancel}
                  className="mb-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
              <AssetForm
                initialData={selectedAsset}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createAsset.isPending || updateAsset.isPending}
                mode={viewMode === 'create' ? 'create' : 'edit'}
              />
            </div>
          </div>
        ) : (
          <>
            <AssetsHeader 
              onFiltersChange={handleFiltersChange}
              onCreateAsset={handleCreateAsset}
              assetsCount={assets.length}
            />
            
            <div className="flex-1 flex overflow-hidden">
              {/* Desktop Layout */}
              <div className="hidden md:flex w-full">
                {/* Sidebar */}
                <AssetsList 
                  assets={assets}
                  selectedAssetId={selectedAsset?.id || null}
                  onSelectAsset={handleSelectAsset}
                />
                
                {/* Detail view */}
                <div className="flex-1 bg-white overflow-y-auto">
                  {selectedAsset ? (
                    <div className="p-4 lg:p-6">
                      <AssetDetailCard 
                        asset={selectedAsset} 
                        onEdit={() => handleEditAsset(selectedAsset)}
                        onDelete={() => handleDeleteAsset(selectedAsset)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium mb-2">No Asset Selected</p>
                        <p className="text-sm">Select an asset from the list to view details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Layout */}
              <div className="md:hidden w-full flex flex-col">
                {viewMode === 'list' ? (
                  <AssetsList 
                    assets={assets}
                    selectedAssetId={selectedAsset?.id || null}
                    onSelectAsset={handleSelectAsset}
                  />
                ) : (
                  <>
                    {/* Mobile header with back button */}
                    <div className="p-3 border-b bg-white flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleBackToList}
                        className="p-1 h-auto"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <span className="font-medium text-gray-900 truncate">
                        {selectedAsset?.name}
                      </span>
                    </div>
                    
                    {/* Mobile detail view */}
                    <div className="flex-1 p-3 overflow-y-auto bg-white">
                      {selectedAsset && (
                        <AssetDetailCard 
                          asset={selectedAsset}
                          onEdit={() => handleEditAsset(selectedAsset)}
                          onDelete={() => handleDeleteAsset(selectedAsset)}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
