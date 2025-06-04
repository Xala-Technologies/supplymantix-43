
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Edit, MoreHorizontal, Copy, Lock, Pause, Play, CheckCircle2, Clock, User, MapPin } from "lucide-react";
import { format } from "date-fns";

interface WorkOrderDetailCardProps {
  workOrder: {
    id: string;
    title: string;
    status: string;
    dueDate: string;
    priority: string;
    assignedTo: string[];
    description: string;
    asset: {
      name: string;
      status: string;
    };
    location: string;
  };
}

export const WorkOrderDetailCard = ({ workOrder }: WorkOrderDetailCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'open':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'done':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MM/dd/yyyy, h:mm a');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4 space-y-4">
          {/* Title and actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
              {workOrder.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Status controls */}
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Status (Click to Update)</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Lock className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Open</span>
              </Button>
              <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
                <Pause className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">On Hold</span>
              </Button>
              <Button size="sm" className={getStatusColor(workOrder.status)}>
                <Play className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">In Progress</span>
              </Button>
              <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Done</span>
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                <Copy className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key information grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-700">Due Date</h4>
              </div>
              <p className="text-sm text-gray-900 ml-6">{formatDueDate(workOrder.dueDate)}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Priority</h4>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(workOrder.priority) === 'text-red-600' ? 'bg-red-500' : getPriorityColor(workOrder.priority) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className={`text-sm font-medium ${getPriorityColor(workOrder.priority)}`}>
                  {workOrder.priority}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Work Order ID</h4>
              <p className="text-sm text-gray-900 font-mono">#{workOrder.id}</p>
            </div>
          </div>

          {/* Assigned to section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-700">Assigned To</h4>
            </div>
            <div className="flex flex-wrap gap-3 ml-6">
              {workOrder.assignedTo.map((assignee, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900 font-medium">{assignee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Description</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{workOrder.description}</p>
            </div>
          </div>

          {/* Asset and Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Asset</h4>
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">{workOrder.asset.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 font-medium">{workOrder.asset.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{workOrder.location}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700">Actions</h4>
            <Button variant="outline" size="sm" className="self-start sm:self-auto">
              View Procedure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
