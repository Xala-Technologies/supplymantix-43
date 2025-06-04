
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Edit, MoreHorizontal, Copy, Lock, Pause, Play, CheckCircle2 } from "lucide-react";
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
        return 'bg-blue-600 text-white';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">{workOrder.title}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">Status (Click to Update)</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                <Lock className="w-4 h-4 mr-1" />
                Open
              </Button>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                <Pause className="w-4 h-4 mr-1" />
                On Hold
              </Button>
              <Button size="sm" className={getStatusColor(workOrder.status)}>
                <Play className="w-4 h-4 mr-1" />
                In Progress
              </Button>
              <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Done
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
            <p className="text-sm text-gray-900">{formatDueDate(workOrder.dueDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
            <span className={`text-sm font-medium ${getPriorityColor(workOrder.priority)}`}>
              ● {workOrder.priority}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Work Order ID</h4>
            <p className="text-sm text-gray-900">#{workOrder.id}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Assigned To</h4>
          <div className="flex items-center space-x-3">
            {workOrder.assignedTo.map((assignee, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {getInitials(assignee)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-900">{assignee}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{workOrder.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Asset</h4>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs">🔧</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{workOrder.asset.name}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">{workOrder.asset.status}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{workOrder.location}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Categories</h4>
            <Button variant="outline" size="sm">
              View Procedure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
