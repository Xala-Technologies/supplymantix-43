
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, User, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { RequestActions } from "./RequestActions";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import type { Request } from "@/types/request";

interface RequestsTableProps {
  requests: Request[];
  selectedRequests: string[];
  onSelectRequest: (requestId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEditRequest: (request: Request) => void;
  onViewRequest: (request: Request) => void;
  userRole?: 'admin' | 'user';
}

export const RequestsTable = ({ 
  requests, 
  selectedRequests,
  onSelectRequest,
  onSelectAll,
  onEditRequest, 
  onViewRequest,
  userRole = 'user'
}: RequestsTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRequests.length === requests.length}
                onCheckedChange={onSelectAll}
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
                    onSelectRequest(request.id, checked as boolean)
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
  );
};
