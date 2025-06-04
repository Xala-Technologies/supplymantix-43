import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Edit, MoreHorizontal, Copy, Lock, Pause, Play, CheckCircle2, Clock, User, MapPin, Plus, ChevronDown, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { WorkOrderProcedures } from "./WorkOrderProcedures";
import { TimeAndCostTracking } from "./TimeAndCostTracking";
import { WorkOrderExecution } from "./WorkOrderExecution";
import { WorkOrderStatusManagement } from "./WorkOrderStatusManagement";
import { WorkOrderAssignment } from "./WorkOrderAssignment";
import { WorkOrderChat } from "./WorkOrderChat";

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
    category?: string;
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

  // Mock data for additional sections
  const categories = ['Reactive Maintenance', 'Project', 'Cleaning'];
  const vendors = [
    { name: 'Grainger', avatar: '🏢', color: 'bg-red-100' },
    { name: 'Apex Mechanics', avatar: 'AM', color: 'bg-orange-100' },
    { name: "O'Conner & Sons Electrical", avatar: 'OS', color: 'bg-blue-100' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 relative">
      {/* Header Card */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          {/* Title and actions */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
              {workOrder.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 flex-shrink-0">
                Mark as Done
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{workOrder.description}</p>
          </div>

          {/* Asset and Location Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Asset</h4>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">{workOrder.asset.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{workOrder.asset.status}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Location</h4>
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{workOrder.location}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-0">
          <Tabs defaultValue="procedures" className="w-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="h-12 p-0 bg-transparent space-x-8">
                <TabsTrigger 
                  value="procedures" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Procedures
                </TabsTrigger>
                <TabsTrigger 
                  value="execution" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Execution
                </TabsTrigger>
                <TabsTrigger 
                  value="status" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Status
                </TabsTrigger>
                <TabsTrigger 
                  value="assignment" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Assignment
                </TabsTrigger>
                <TabsTrigger 
                  value="tracking" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Time & Cost
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
                >
                  Discussion
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="procedures" className="mt-0">
                <WorkOrderProcedures workOrderId={workOrder.id} workOrder={workOrder} />
              </TabsContent>

              <TabsContent value="execution" className="mt-0">
                <WorkOrderExecution workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="status" className="mt-0">
                <WorkOrderStatusManagement 
                  workOrder={workOrder}
                  onStatusChange={(newStatus, comment) => {
                    console.log('Status change:', newStatus, comment);
                  }}
                />
              </TabsContent>

              <TabsContent value="assignment" className="mt-0">
                <WorkOrderAssignment 
                  workOrder={workOrder}
                  onAssignmentChange={(assigneeIds, comment) => {
                    console.log('Assignment change:', assigneeIds, comment);
                  }}
                />
              </TabsContent>

              <TabsContent value="tracking" className="mt-0">
                <TimeAndCostTracking workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="chat" className="mt-0">
                <WorkOrderChat workOrderId={workOrder.id} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Updated Vendors Card - removed the View Procedure button */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vendors</h3>
          </div>
          
          <div className="space-y-3">
            {vendors.map((vendor, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 ${vendor.color} rounded-full flex items-center justify-center`}>
                  <span className="text-sm font-semibold text-gray-700">
                    {vendor.avatar.length > 2 ? vendor.avatar : vendor.avatar}
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{vendor.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Created by Dillan Menting on 09/08/2023, 4:27 PM</span>
            </div>
            <div>
              <span className="text-gray-700">Last updated on 10/01/2023, 5:32 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 backdrop-blur-sm bg-white/95">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={() => {
              // Navigate to procedures or open procedures modal
              console.log('View procedures clicked');
            }}
          >
            <ListTodo className="w-5 h-5 mr-2" />
            View Procedures
          </Button>
        </div>
      </div>
    </div>
  );
};
