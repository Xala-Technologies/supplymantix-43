
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { ClientsList } from "@/components/clients/ClientsList";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientDetail } from "@/components/clients/ClientDetail";
import { useState } from "react";
import { ChevronLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, type Client } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

export default function Clients() {
  const { user, loading: authLoading } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters = {
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data: clients = [], isLoading, error, refetch } = useClients(filters);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setViewMode('detail');
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setViewMode('create');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setViewMode('edit');
  };

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to deactivate "${client.name}"?`)) {
      deleteClient.mutate(client.id, {
        onSuccess: () => {
          if (selectedClient?.id === client.id) {
            setViewMode('list');
            setSelectedClient(null);
          }
          refetch();
          toast.success('Client deactivated successfully');
        },
        onError: (error) => {
          console.error('Failed to delete client:', error);
          toast.error('Failed to deactivate client');
        }
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    if (viewMode === 'create') {
      createClient.mutate(data, {
        onSuccess: () => {
          setViewMode('list');
          refetch();
          toast.success('Client created successfully');
        },
        onError: (error) => {
          console.error('Failed to create client:', error);
          toast.error('Failed to create client');
        }
      });
    } else if (viewMode === 'edit' && selectedClient) {
      updateClient.mutate({ id: selectedClient.id, updates: data }, {
        onSuccess: (updatedClient) => {
          setSelectedClient(updatedClient);
          setViewMode('detail');
          refetch();
          toast.success('Client updated successfully');
        },
        onError: (error) => {
          console.error('Failed to update client:', error);
          toast.error('Failed to update client');
        }
      });
    }
  };

  const handleFormCancel = () => {
    if (selectedClient && viewMode === 'edit') {
      setViewMode('detail');
    } else {
      setViewMode('list');
      setSelectedClient(null);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClient(null);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageContent>
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading clients...</p>
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
                <p className="text-red-600 mb-4">Error loading clients: {error.message}</p>
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
              title={viewMode === 'create' ? 'Create Client' : 'Edit Client'}
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
              <ClientForm
                initialData={selectedClient}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createClient.isPending || updateClient.isPending}
                mode={viewMode === 'create' ? 'create' : 'edit'}
              />
            </StandardPageContent>
          </>
        ) : viewMode === 'detail' ? (
          <>
            <StandardPageHeader 
              title={selectedClient?.name || 'Client Details'}
              leftContent={
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Clients
                </Button>
              }
            />
            
            <StandardPageContent>
              {selectedClient && (
                <ClientDetail 
                  client={selectedClient}
                  onEdit={() => setViewMode('edit')}
                  onBack={handleBackToList}
                />
              )}
            </StandardPageContent>
          </>
        ) : (
          <>
            <StandardPageHeader 
              title="Clients"
              description="Manage your organization's clients and customer relationships"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  {clients.length} {clients.length === 1 ? 'Client' : 'Clients'}
                </span>
              </div>
            </StandardPageHeader>
            
            <StandardPageContent>
              <ClientsList
                clients={clients}
                isLoading={isLoading}
                onCreateClient={handleCreateClient}
                onViewClient={handleViewClient}
                onEditClient={handleEditClient}
                onDeleteClient={handleDeleteClient}
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
