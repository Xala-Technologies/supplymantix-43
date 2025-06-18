
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PageContainer } from "@/components/Layout/PageContainer";
import { PageHeader } from "@/components/Layout/PageHeader";
import { PageContent } from "@/components/Layout/PageContent";
import { RequestsHeader } from "@/components/requests/RequestsHeader";
import { RequestsList } from "@/components/requests/RequestsList";
import { RequestForm } from "@/components/requests/RequestForm";
import { RequestDetailDialog } from "@/components/requests/RequestDetailDialog";
import { useRequests, useCreateRequest, useUpdateRequest, useDeleteRequest } from "@/hooks/useRequests";
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

  if (view === "create") {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Create New Request"
            description="Submit a new request for maintenance, repairs, or services"
            showBackButton
            onBack={() => setView("list")}
            backButtonText="Back to Requests"
          />
          <PageContent>
            <RequestForm
              onSubmit={handleCreateRequest}
              onCancel={() => setView("list")}
              isLoading={createRequest.isPending}
              mode="create"
            />
          </PageContent>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (view === "edit" && selectedRequest) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Edit Request"
            description="Update request details and information"
            showBackButton
            onBack={() => {
              setView("list");
              setSelectedRequest(null);
            }}
            backButtonText="Back to Requests"
          />
          <PageContent>
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
          </PageContent>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Requests"
          description="Manage and track maintenance requests and service tickets"
        />
        <PageContent>
          <div className="space-y-6">
            <RequestsHeader
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
            />

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
        </PageContent>
      </PageContainer>
    </DashboardLayout>
  );
}
