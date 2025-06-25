
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, User, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { RequestActions } from "./RequestActions";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestPriorityBadge } from "./RequestPriorityBadge";
import type { Request } from "@/types/request";

interface RequestsGridProps {
  requests: Request[];
  selectedRequests: string[];
  onSelectRequest: (requestId: string, checked: boolean) => void;
  onEditRequest: (request: Request) => void;
  onViewRequest: (request: Request) => void;
  userRole?: 'admin' | 'user';
}

export const RequestsGrid = ({ 
  requests, 
  selectedRequests,
  onSelectRequest,
  onEditRequest, 
  onViewRequest,
  userRole = 'user'
}: RequestsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow relative">
          <div className="absolute top-4 left-4">
            <Checkbox
              checked={selectedRequests.includes(request.id)}
              onCheckedChange={(checked) => 
                onSelectRequest(request.id, checked as boolean)
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
  );
};
