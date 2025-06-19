import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PageLayout, PageLayoutHeader, PageFilters, PageLayoutContent } from "@/components/Layout/PageLayout";
import { AssetsHeader } from "@/components/assets/AssetsHeader";
import { AssetsGrid } from "@/components/assets/AssetsGrid";
import { AssetDetailCard } from "@/components/assets/AssetDetailCard";
import { AssetForm } from "@/components/assets/AssetForm";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset, type Asset as DatabaseAsset } from "@/hooks/useAssets";
import { toast } from "sonner";

// UI Asset type for AssetsGrid component
interface UIAsset {
  id: string;
  name: string;
  tag: string;
  status: string;
  location: string;
  category: string;
  criticality: string;
  nextMaintenance: string;
  workOrders: number;
  totalDowntime: string;
}

// Asset type expected by AssetDetailCard
interface DetailAsset {
  id: string;
  name: string;
  tag: string;
  status: string;
  location: string;
  category: string;
  criticality: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  workOrders: number;
  totalDowntime: string;
  specifications: Record<string, string>;
  documentation: Array<{ name: string; type: string; size: string }>;
}

type ViewMode = 'grid' | 'detail' | 'create' | 'edit';

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState<DatabaseAsset | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState({
    search: "",
    status: [] as string[],
    category: [] as string[],
    location: [] as string[],
    criticality: [] as string[]
  });

  // API hooks
  const { data: assets = [], isLoading, error, refetch } = useAssets(filters);
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const deleteAsset = useDeleteAsset();

  console.log('Assets data:', assets); // Debug log

  // Convert database assets to UI assets
  const convertToUIAssets = (dbAssets: DatabaseAsset[]): UIAsset[] => {
    return dbAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      tag: asset.asset_tag || `AST-${asset.id.slice(-6)}`,
      status: asset.status,
      location: asset.location || 'Unassigned',
      category: asset.category || 'Equipment',
      criticality: asset.criticality || 'Medium',
      nextMaintenance: '2024-07-01', // Placeholder - would come from maintenance schedules
      workOrders: 0, // Placeholder - would come from work orders
      totalDowntime: '0h' // Placeholder - would come from downtime tracking
    }));
  };

  // Convert database asset to detail asset format
  const convertToDetailAsset = (dbAsset: DatabaseAsset): DetailAsset => {
    return {
      id: dbAsset.id,
      name: dbAsset.name,
      tag: dbAsset.asset_tag || `AST-${dbAsset.id.slice(-6)}`,
      status: dbAsset.status,
      location: dbAsset.location || 'Unassigned',
      category: dbAsset.category || 'Equipment',
      criticality: dbAsset.criticality || 'Medium',
      manufacturer: 'Unknown', // Placeholder - would be added to database schema
      model: 'Unknown', // Placeholder - would be added to database schema
      serialNumber: dbAsset.asset_tag || 'N/A', // Using asset_tag as placeholder
      installDate: dbAsset.created_at?.split('T')[0] || '2024-01-01',
      lastMaintenance: '2024-06-01', // Placeholder - would come from maintenance records
      nextMaintenance: '2024-07-01', // Placeholder - would come from maintenance schedules
      workOrders: 0, // Placeholder - would come from work orders
      totalDowntime: '0h', // Placeholder - would come from downtime tracking
      specifications: {
        'Power': 'N/A',
        'Weight': 'N/A',
        'Dimensions': 'N/A'
      },
      documentation: [
        { name: 'Manual.pdf', type: 'PDF', size: '2.5 MB' },
        { name: 'Warranty.pdf', type: 'PDF', size: '1.2 MB' }
      ]
    };
  };

  const uiAssets = convertToUIAssets(assets);

  const handleSelectAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setViewMode('detail');
    }
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setViewMode('create');
  };

  const handleEditAsset = (uiAsset: UIAsset) => {
    const asset = assets.find(a => a.id === uiAsset.id);
    if (asset) {
      setSelectedAsset(asset);
      setViewMode('edit');
    }
  };

  const handleDeleteAsset = (uiAsset: UIAsset) => {
    const asset = assets.find(a => a.id === uiAsset.id);
    if (asset && confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      deleteAsset.mutate(asset.id, {
        onSuccess: () => {
          if (selectedAsset?.id === asset.id) {
            setViewMode('grid');
            setSelectedAsset(null);
          }
          refetch();
        },
        onError: (error) => {
          console.error('Failed to delete asset:', error);
          toast.error('Failed to delete asset');
        }
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    if (viewMode === 'create') {
      createAsset.mutate(data, {
        onSuccess: (newAsset) => {
          console.log('Asset created successfully:', newAsset);
          setViewMode('grid');
          refetch();
          toast.success('Asset created successfully');
        },
        onError: (error) => {
          console.error('Failed to create asset:', error);
          toast.error('Failed to create asset. Please check the console for details.');
        }
      });
    } else if (viewMode === 'edit' && selectedAsset) {
      updateAsset.mutate({ id: selectedAsset.id, updates: data }, {
        onSuccess: (updatedAsset) => {
          console.log('Asset updated successfully:', updatedAsset);
          setSelectedAsset(updatedAsset);
          setViewMode('detail');
          refetch();
          toast.success('Asset updated successfully');
        },
        onError: (error) => {
          console.error('Failed to update asset:', error);
          toast.error('Failed to update asset');
        }
      });
    }
  };

  const handleFormCancel = () => {
    if (selectedAsset && (viewMode === 'edit')) {
      setViewMode('detail');
    } else {
      setViewMode('grid');
      setSelectedAsset(null);
    }
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedAsset(null);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <DashboardLayout>
        <PageLayout>
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading assets: {error.message}</p>
              <Button onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </div>
        </PageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageLayout>
        {(viewMode === 'create' || viewMode === 'edit') ? (
          // Form View
          <>
            <PageLayoutHeader 
              title={viewMode === 'create' ? 'Create Asset' : 'Edit Asset'}
            >
              <Button 
                variant="outline" 
                onClick={handleFormCancel}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </PageLayoutHeader>
            
            <PageLayoutContent>
              <div className="p-6 bg-white">
                <AssetForm
                  initialData={selectedAsset}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  isLoading={createAsset.isPending || updateAsset.isPending}
                  mode={viewMode === 'create' ? 'create' : 'edit'}
                />
              </div>
            </PageLayoutContent>
          </>
        ) : viewMode === 'detail' ? (
          // Detail View with enhanced header design
          <>
            <PageLayoutHeader 
              title={selectedAsset?.name || 'Asset Details'}
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackToGrid}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Assets
              </Button>
            </PageLayoutHeader>
            
            <PageLayoutContent>
              <div className="p-6 bg-white h-full overflow-y-auto">
                {selectedAsset && (
                  <AssetDetailCard 
                    asset={convertToDetailAsset(selectedAsset)}
                    onEdit={() => setViewMode('edit')}
                    onDelete={() => {
                      const uiAsset = convertToUIAssets([selectedAsset])[0];
                      handleDeleteAsset(uiAsset);
                    }}
                  />
                )}
              </div>
            </PageLayoutContent>
          </>
        ) : (
          // Grid View
          <>
            <PageLayoutHeader 
              title="Assets"
            >
              <Button onClick={handleCreateAsset} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Asset
              </Button>
            </PageLayoutHeader>

            <PageFilters>
              <AssetsHeader 
                onFiltersChange={handleFiltersChange}
                onCreateAsset={handleCreateAsset}
                assets={assets}
              />
            </PageFilters>
            
            <PageLayoutContent>
              <AssetsGrid
                assets={uiAssets}
                selectedAssetId={selectedAsset?.id || null}
                onSelectAsset={handleSelectAsset}
                onCreateAsset={handleCreateAsset}
                onEditAsset={handleEditAsset}
                onDeleteAsset={handleDeleteAsset}
                isLoading={isLoading}
              />
            </PageLayoutContent>
          </>
        )}
      </PageLayout>
    </DashboardLayout>
  );
}
