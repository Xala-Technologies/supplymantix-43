
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageFilters, StandardPageContent } from "@/components/Layout/StandardPageLayout";
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

  const userRole = 'admin';

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
    toast.success(`Ready to process ${importedRequests.length} imported requests`);
    console.log("Imported requests:", importedRequests);
  };

  if (view === "create") {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageHeader
            title="Create New Request"
            description="Submit a new request for maintenance, repairs, or services"
            leftContent={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("list")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Requests
              </Button>
            }
          />
          
          <StandardPageContent>
            <RequestForm
              onSubmit={handleCreateRequest}
              onCancel={() => setView("list")}
              isLoading={createRequest.isPending}
              mode="create"
            />
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  if (view === "edit" && selectedRequest) {
    return (
      <DashboardLayout>
        <StandardPageLayout>
          <StandardPageHeader
            title="Edit Request"
            description="Update request details and information"
            leftContent={
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
            }
          />
          
          <StandardPageContent>
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
          </StandardPageContent>
        </StandardPageLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageFilters>
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
        </StandardPageFilters>
        
        <StandardPageContent>
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
        </StandardPageContent>

        <RequestDetailDialog
          request={selectedRequest}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      </StandardPageLayout>
    </DashboardLayout>
  );
}
