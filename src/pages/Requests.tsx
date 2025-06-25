
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PageContainer } from "@/components/Layout/PageContainer";
import { PageLayout } from "@/components/Layout/PageLayout";
import { PageContent } from "@/components/Layout/PageContent";
import { RequestsPageHeader } from "@/components/requests/RequestsPageHeader";
import { RequestsList } from "@/components/requests/RequestsList";
import { RequestForm } from "@/components/requests/RequestForm";
import { RequestDetailDialog } from "@/components/requests/RequestDetailDialog";
import { useRequests, useCreateRequest, useUpdateRequest, useDeleteRequest } from "@/hooks/useRequests";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Request, CreateRequestRequest } from "@/types/request";

export default function Requests() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Simulate user role - in real app this would come from auth context
  const userRole = 'admin'; // or 'user'

  const { data: requests = [], isLoading } = useRequests();
  const createRequest = useCreateRequest();
  const updateRequest = useUpdateRequest();
  const deleteRequest = useDeleteRequest();

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateRequest = (data: CreateRequestRequest) => {
    createRequest.mutate(data, {
      onSuccess: () => {
        setView("list");
      }
    });
  };

  const handleEditRequest = (data: CreateRequestRequest) => {
    if (!selectedRequest) return;
    
    updateRequest.mutate(
      { id: selectedRequest.id, ...data },
      {
        onSuccess: () => {
          setView("list");
          setSelectedRequest(null);
        }
      }
    );
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest.mutate(id);
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  const handleEditMode = (request: Request) => {
    setSelectedRequest(request);
    setView("edit");
  };

  const handleImportRequests = (importedRequests: any[]) => {
    // Here you would typically process and create the imported requests
    // For now, just show a success message
    toast.success(`Ready to process ${importedRequests.length} imported requests`);
    console.log("Imported requests:", importedRequests);
  };

  if (view === "create") {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col bg-white">
          <div className="border-b border-gray-200 bg-white">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("list")}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Requests
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
                  <p className="text-sm text-gray-600 mt-1">Submit a new request for maintenance, repairs, or services</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <RequestForm
                onSubmit={handleCreateRequest}
                onCancel={() => setView("list")}
                isLoading={createRequest.isPending}
                mode="create"
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (view === "edit" && selectedRequest) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col bg-white">
          <div className="border-b border-gray-200 bg-white">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setView("list");
                    setSelectedRequest(null);
                  }}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Requests
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Request</h1>
                  <p className="text-sm text-gray-600 mt-1">Update request details and information</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <RequestForm
                onSubmit={handleEditRequest}
                onCancel={() => {
                  setView("list");
                  setSelectedRequest(null);
                }}
                isLoading={updateRequest.isPending}
                initialData={selectedRequest}
                mode="edit"
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-white">
        <RequestsPageHeader
          onCreateRequest={() => setView("create")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          userRole={userRole}
          requests={requests}
          onImportRequests={handleImportRequests}
        />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : (
              <RequestsList
                requests={filteredRequests}
                onEditRequest={handleEditMode}
                onDeleteRequest={handleDeleteRequest}
                onViewRequest={handleViewRequest}
                viewMode={viewMode}
                userRole={userRole}
              />
            )}

            <RequestDetailDialog
              request={selectedRequest}
              open={detailDialogOpen}
              onOpenChange={setDetailDialogOpen}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
