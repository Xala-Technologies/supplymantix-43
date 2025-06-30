
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { VendorsList } from "@/components/vendors/VendorsList";
import { VendorForm } from "@/components/vendors/VendorForm";
import { VendorDetail } from "@/components/vendors/VendorDetail";
import { useState } from "react";
import { ChevronLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor, type Vendor } from "@/hooks/useVendors";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export default function Vendors() {
  const { user, loading: authLoading } = useAuth();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = {
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data: vendors = [], isLoading, error, refetch } = useVendors(filters);
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewMode('detail');
  };

  const handleCreateVendor = () => {
    setSelectedVendor(null);
    setViewMode('create');
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewMode('edit');
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    if (confirm(`Are you sure you want to deactivate "${vendor.name}"?`)) {
      deleteVendor.mutate(vendor.id, {
        onSuccess: () => {
          if (selectedVendor?.id === vendor.id) {
            setViewMode('list');
            setSelectedVendor(null);
          }
          refetch();
          toast.success('Vendor deactivated successfully');
        },
        onError: (error) => {
          console.error('Failed to delete vendor:', error);
          toast.error('Failed to deactivate vendor');
        }
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    if (viewMode === 'create') {
      createVendor.mutate(data, {
        onSuccess: () => {
          setViewMode('list');
          refetch();
          toast.success('Vendor created successfully');
        },
        onError: (error) => {
          console.error('Failed to create vendor:', error);
          toast.error('Failed to create vendor');
        }
      });
    } else if (viewMode === 'edit' && selectedVendor) {
      updateVendor.mutate({ id: selectedVendor.id, updates: data }, {
        onSuccess: (updatedVendor) => {
          setSelectedVendor(updatedVendor);
          setViewMode('detail');
          refetch();
          toast.success('Vendor updated successfully');
        },
        onError: (error) => {
          console.error('Failed to update vendor:', error);
          toast.error('Failed to update vendor');
        }
      });
    }
  };

  const handleFormCancel = () => {
    if (selectedVendor && viewMode === 'edit') {
      setViewMode('detail');
    } else {
      setViewMode('list');
      setSelectedVendor(null);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedVendor(null);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading vendors...</p>
              </div>
            </div>
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">Error loading vendors: {error.message}</p>
                <Button onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            </div>
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StandardPageLayout>
        {(viewMode === 'create' || viewMode === 'edit') ? (
          <>
            <StandardPageHeader 
              title={viewMode === 'create' ? 'Create Vendor' : 'Edit Vendor'}
              leftContent={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFormCancel}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              }
            />
            
            <StandardPageContent>
              <VendorForm
                initialData={selectedVendor}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createVendor.isPending || updateVendor.isPending}
                mode={viewMode === 'create' ? 'create' : 'edit'}
              />
            </StandardPageContent>
          </>
        ) : viewMode === 'detail' ? (
          <>
            <StandardPageHeader 
              title={selectedVendor?.name || 'Vendor Details'}
              leftContent={
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Vendors
                </Button>
              }
            />
            
            <StandardPageContent>
              {selectedVendor && (
                <VendorDetail 
                  vendor={selectedVendor}
                  onEdit={() => setViewMode('edit')}
                  onBack={handleBackToList}
                />
              )}
            </StandardPageContent>
          </>
        ) : (
          <>
            <StandardPageHeader 
              title="Vendors"
              description="Manage your organization's vendors and supplier relationships"
            >
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  {vendors.length} {vendors.length === 1 ? 'Vendor' : 'Vendors'}
                </span>
              </div>
            </StandardPageHeader>
            
            <StandardPageContent>
              <VendorsList
                vendors={vendors}
                isLoading={isLoading}
                onCreateVendor={handleCreateVendor}
                onViewVendor={handleViewVendor}
                onEditVendor={handleEditVendor}
                onDeleteVendor={handleDeleteVendor}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </StandardPageContent>
          </>
        )}
      </StandardPageLayout>
    </DashboardLayout>
  );
}
