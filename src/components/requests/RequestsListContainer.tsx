
import React, { useState } from "react";
import { RequestBulkActions } from "./RequestBulkActions";
import { RequestsGrid } from "./RequestsGrid";
import { RequestsTable } from "./RequestsTable";
import { RequestsEmptyState } from "./RequestsEmptyState";
import type { Request } from "@/types/request";

interface RequestsListContainerProps {
  requests: Request[];
  onEditRequest: (request: Request) => void;
  onDeleteRequest: (id: string) => void;
  onViewRequest: (request: Request) => void;
  viewMode?: 'grid' | 'table';
  userRole?: 'admin' | 'user';
}

export const RequestsListContainer = ({ 
  requests, 
  onEditRequest, 
  onDeleteRequest, 
  onViewRequest,
  viewMode = 'grid',
  userRole = 'user'
}: RequestsListContainerProps) => {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests(prev => [...prev, requestId]);
    } else {
      setSelectedRequests(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(requests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const clearSelection = () => setSelectedRequests([]);

  if (requests.length === 0) {
    return <RequestsEmptyState />;
  }

  return (
    <div className="space-y-4">
      <RequestBulkActions 
        selectedRequests={selectedRequests}
        onClearSelection={clearSelection}
        userRole={userRole}
      />
      
      {viewMode === 'table' ? (
        <RequestsTable
          requests={requests}
          selectedRequests={selectedRequests}
          onSelectRequest={handleSelectRequest}
          onSelectAll={handleSelectAll}
          onEditRequest={onEditRequest}
          onViewRequest={onViewRequest}
          userRole={userRole}
        />
      ) : (
        <RequestsGrid
          requests={requests}
          selectedRequests={selectedRequests}
          onSelectRequest={handleSelectRequest}
          onEditRequest={onEditRequest}
          onViewRequest={onViewRequest}
          userRole={userRole}
        />
      )}
    </div>
  );
};
