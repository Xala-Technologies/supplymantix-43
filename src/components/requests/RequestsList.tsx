
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Calendar, User, MapPin, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { Request } from "@/types/request";

interface RequestsListProps {
  requests: Request[];
  onEditRequest: (request: Request) => void;
  onDeleteRequest: (id: string) => void;
  onViewRequest: (request: Request) => void;
}

export const RequestsList = ({ requests, onEditRequest, onDeleteRequest, onViewRequest }: RequestsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle 
                  className="text-lg leading-6 cursor-pointer hover:text-blue-600"
                  onClick={() => onViewRequest(request)}
                >
                  {request.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewRequest(request)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditRequest(request)}>
                    Edit Request
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteRequest(request.id)}
                    className="text-red-600"
                  >
                    Delete Request
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
