
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { RequestsHeader } from "@/components/requests/RequestsHeader";
import { RequestsList } from "@/components/requests/RequestsList";
import { RequestForm } from "@/components/requests/RequestForm";
import { RequestDetailDialog } from "@/components/requests/RequestDetailDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRequests, useCreateRequest, useUpdateRequest, useDeleteRequest } from "@/hooks/useRequests";
import type { Request, CreateRequestRequest } from "@/types/request";

export default function Requests() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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
        <div className="h-full">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("list")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Request</h1>
              <p className="text-sm text-muted-foreground">
                Submit a new request for maintenance, repairs, or services
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <RequestForm
              onSubmit={handleCreateRequest}
              onCancel={() => setView("list")}
              isLoading={createRequest.isPending}
              mode="create"
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (view === "edit" && selectedRequest) {
    return (
      <DashboardLayout>
        <div className="h-full">
          <div className="flex items-center gap-4 p-4 border-b bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setView("list");
                setSelectedRequest(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Request</h1>
              <p className="text-sm text-muted-foreground">
                Update request details and information
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full">
        <div className="flex items-center gap-4 p-4 border-b bg-white">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Requests</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track maintenance requests and service tickets
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <RequestsHeader
              onCreateRequest={() => setView("create")}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />

            {isLoading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : (
              <RequestsList
                requests={filteredRequests}
                onEditRequest={handleEditMode}
                onDeleteRequest={handleDeleteRequest}
                onViewRequest={handleViewRequest}
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
