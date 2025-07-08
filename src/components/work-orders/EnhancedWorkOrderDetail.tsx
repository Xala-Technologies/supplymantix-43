
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Tag, 
  FileText,
  CheckSquare,
  DollarSign,
  Settings,
  MessageSquare,
  Paperclip
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { EnhancedChecklistSimple } from "./EnhancedChecklistSimple";
import { WorkOrderStatusFlow } from "./WorkOrderStatusFlow";
import { TimeEntries } from "./TimeEntries";
import { CostEntries } from "./CostEntries";
import { WorkOrderChat } from "./WorkOrderChat";
import { FileUploadSection } from "./FileUploadSection";
import { getAssetName, getLocationName } from "@/utils/assetUtils";
import { useWorkOrderStatusUpdate } from "@/hooks/useWorkOrdersIntegration";
import { useWorkOrderAttachments } from "@/hooks/useWorkOrderAttachments";

interface EnhancedWorkOrderDetailProps {
  workOrder: WorkOrder;
  onEdit: () => void;
}

export const EnhancedWorkOrderDetail = ({ workOrder, onEdit }: EnhancedWorkOrderDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const updateStatus = useWorkOrderStatusUpdate();
  const { attachments } = useWorkOrderAttachments(workOrder.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id: workOrder.id,
        status: newStatus as any,
        notes: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleChecklistUpdate = () => {
    // This would trigger a refresh of the work order data
    console.log('Checklist updated');
  };

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workOrder.title}</h1>
              <p className="text-sm text-gray-600">Work Order #{workOrder.id.slice(-8)}</p>
            </div>
          </div>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${getStatusColor(workOrder.status)} font-medium border`}>
            {workOrder.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={`${getPriorityColor(workOrder.priority)} font-medium border`}>
            {workOrder.priority.toUpperCase()} PRIORITY
          </Badge>
          {workOrder.category && (
            <Badge variant="outline" className="font-medium">
              {workOrder.category}
            </Badge>
          )}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{workOrder.assignedTo[0]}</span>
            </div>
          )}
          {workOrder.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{new Date(workOrder.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {workOrder.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{getLocationName(workOrder.location)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{workOrder.timeSpent || 0}h spent</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="checklist" className="gap-2">
              <CheckSquare className="w-4 h-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="attachments" className="gap-2">
              <Paperclip className="w-4 h-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <Settings className="w-4 h-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="time" className="gap-2">
              <Clock className="w-4 h-4" />
              Time
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Costs
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {workOrder.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {workOrder.tags && workOrder.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {workOrder.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {workOrder.asset && (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Asset Name:</span>
                      <span>{getAssetName(workOrder.asset)}</span>
                    </div>
                    {typeof workOrder.asset === 'object' && 'status' in workOrder.asset && workOrder.asset.status && (
                      <div className="flex justify-between">
                        <span className="font-medium">Asset Status:</span>
                        <Badge variant="outline">{String(workOrder.asset.status)}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checklist">
            <EnhancedChecklistSimple 
              workOrderId={workOrder.id}
              onUpdate={handleChecklistUpdate}
            />
          </TabsContent>

          <TabsContent value="attachments">
            <Card>
              <CardHeader>
                <CardTitle>Files & Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploadSection
                  workOrderId={workOrder.id}
                  initialFiles={attachments}
                  maxFiles={20}
                  maxSize={25}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <WorkOrderStatusFlow 
              workOrder={workOrder}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="time">
            <TimeEntries 
              workOrderId={workOrder.id}
              onSubmit={(timeData) => console.log('Time entry submitted:', timeData)}
            />
          </TabsContent>

          <TabsContent value="costs">
            <CostEntries 
              workOrderId={workOrder.id}
              onSubmit={(costData) => console.log('Cost entry submitted:', costData)}
            />
          </TabsContent>

          <TabsContent value="chat">
            <WorkOrderChat workOrderId={workOrder.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
