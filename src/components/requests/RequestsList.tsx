
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, User, MapPin, AlertCircle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { RequestActions } from "./RequestActions";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import { RequestBulkActions } from "./RequestBulkActions";
import type { Request } from "@/types/request";

interface RequestsListProps {
  requests: Request[];
  onEditRequest: (request: Request) => void;
  onDeleteRequest: (id: string) => void;
  onViewRequest: (request: Request) => void;
  viewMode?: 'grid' | 'table';
  userRole?: 'admin' | 'user';
}

export const RequestsList = ({ 
  requests, 
  onEditRequest, 
  onDeleteRequest, 
  onViewRequest,
  viewMode = 'grid',
  userRole = 'user'
}: RequestsListProps) => {
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
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500 text-center">
            Get started by creating your first maintenance request.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="space-y-4">
        <RequestBulkActions 
          selectedRequests={selectedRequests}
          onClearSelection={clearSelection}
          userRole={userRole}
        />
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRequests.length === requests.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onCheckedChange={(checked) => 
                        handleSelectRequest(request.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <button 
                        className="font-medium text-blue-600 hover:text-blue-800 text-left"
                        onClick={() => onViewRequest(request)}
                      >
                        {request.title}
                      </button>
                      {request.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {request.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <RequestPriorityBadge priority={request.priority} size="sm" />
                  </TableCell>
                  <TableCell>
                    <RequestStatusBadge status={request.status} size="sm" />
                  </TableCell>
                  <TableCell>
                    {request.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {request.location}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.due_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(request.due_date), "MMM d")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.estimated_cost && request.estimated_cost > 0 && (
                      <div className="flex items-center text-sm text-green-600">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {request.estimated_cost.toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {format(new Date(request.created_at), "MMM d")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <RequestActions
                      request={request}
                      onEdit={onEditRequest}
                      onView={onViewRequest}
                      userRole={userRole}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RequestBulkActions 
        selectedRequests={selectedRequests}
        onClearSelection={clearSelection}
        userRole={userRole}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 left-4">
              <Checkbox
                checked={selectedRequests.includes(request.id)}
                onCheckedChange={(checked) => 
                  handleSelectRequest(request.id, checked as boolean)
                }
              />
            </div>
            
            <CardHeader className="pb-3 pl-12">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle 
                    className="text-lg leading-6 cursor-pointer hover:text-blue-600"
                    onClick={() => onViewRequest(request)}
                  >
                    {request.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <RequestPriorityBadge priority={request.priority} size="sm" />
                    <RequestStatusBadge status={request.status} size="sm" />
                  </div>
                </div>
                <RequestActions
                  request={request}
                  onEdit={onEditRequest}
                  onView={onViewRequest}
                  userRole={userRole}
                />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {request.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                {request.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location}</span>
                  </div>
                )}

                {request.due_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {format(new Date(request.due_date), "MMM d, yyyy")}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Created: {format(new Date(request.created_at), "MMM d, yyyy")}</span>
                </div>

                {request.estimated_cost && request.estimated_cost > 0 && (
                  <div className="text-sm font-medium text-green-600">
                    Estimated: ${request.estimated_cost.toFixed(2)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
