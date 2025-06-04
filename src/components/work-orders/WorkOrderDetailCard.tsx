
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MapPin, AlertTriangle, User, Wrench, Clock } from "lucide-react";
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAssetStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy • h:mm a');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Work Order #{workOrder.id}</span>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {workOrder.title}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(workOrder.status)} border`}>
              {workOrder.status}
            </Badge>
            <Badge className={`${getPriorityColor(workOrder.priority)} border`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {workOrder.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {workOrder.description}
          </p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-medium text-gray-700">Due Date</h4>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-900">{formatDueDate(workOrder.dueDate)}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-medium text-gray-700">Location</h4>
            </div>
            <span className="text-sm text-gray-900">{workOrder.location}</span>
          </div>
        </div>

        {/* Asset Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Asset</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">{workOrder.asset.name}</span>
              </div>
              <Badge className={`${getAssetStatusColor(workOrder.asset.status)} border text-xs`}>
                {workOrder.asset.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Assigned Team */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {workOrder.assignedTo.map((assignee, index) => (
              <div key={index} className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {getInitials(assignee)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-blue-900">{assignee}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
