
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  MapPin, 
  AlertCircle, 
  Calendar, 
  Tag,
  FileText,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Timer,
  Edit
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { EnhancedChecklist } from "./EnhancedChecklist";
import { WorkOrderStatusFlow } from "./WorkOrderStatusFlow";
import { WorkOrderTimeTracking } from "./WorkOrderTimeTracking";
import { TimeAndCostTracking } from "./TimeAndCostTracking";
import { getAssetName, getLocationName } from "@/utils/assetUtils";

interface EnhancedWorkOrderDetailProps {
  workOrder: WorkOrder;
  onEdit?: () => void;
}

export const EnhancedWorkOrderDetail = ({ 
  workOrder, 
  onEdit 
}: EnhancedWorkOrderDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800 border-gray-300',
      'open': 'bg-blue-100 text-blue-800 border-blue-300',
      'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'on_hold': 'bg-orange-100 text-orange-800 border-orange-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'archived': 'bg-slate-100 text-slate-800 border-slate-300',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'urgent': 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const isOverdue = workOrder.due_date && new Date(workOrder.due_date) < new Date() && workOrder.status !== 'completed';

  return (
    <div className="h-full overflow-auto">
      <Card className="h-full border-0 shadow-none rounded-none bg-gradient-to-br from-gray-50/50 to-white">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold leading-tight">{workOrder.title}</CardTitle>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                  <FileText className="w-4 h-4" />
                  #{workOrder.id.slice(-8)}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {getAssetName(workOrder.asset)}
                </span>
                {workOrder.location && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {getLocationName(workOrder.location)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={`border ${getStatusColor(workOrder.status)} font-medium`}>
                  {workOrder.status.replace('_', ' ')}
                </Badge>
                <Badge className={`border ${getPriorityColor(workOrder.priority)} font-medium`}>
                  {workOrder.priority} priority
                </Badge>
                {isOverdue && (
                  <Badge className="bg-red-100 text-red-800 border-red-300 font-medium">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {workOrder.description && (
            <div className="bg-white/10 rounded-xl p-4 border border-white/20 mt-4">
              <h3 className="font-semibold text-white mb-2">Description</h3>
              <p className="text-blue-100 leading-relaxed">{workOrder.description}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1">
          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {workOrder.due_date && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Due Date</div>
                  <div className={`text-sm ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                    {new Date(workOrder.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Assigned To</div>
                <div className="text-sm text-gray-600">
                  {workOrder.assignedTo?.length > 0 ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                </div>
              </div>
            </div>
            
            {workOrder.category && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Category</div>
                  <div className="text-sm text-gray-600 capitalize">{workOrder.category}</div>
                </div>
              </div>
            )}

            {(workOrder.time_spent || workOrder.timeSpent) && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Time Spent</div>
                  <div className="text-sm text-gray-600">
                    {workOrder.time_spent || workOrder.timeSpent} hours
                  </div>
                </div>
              </div>
            )}

            {(workOrder.total_cost || workOrder.totalCost) && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <div className="w-5 h-5 text-white flex items-center justify-center font-bold text-sm">$</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Total Cost</div>
                  <div className="text-sm text-gray-600">
                    ${(workOrder.total_cost || workOrder.totalCost)?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          {workOrder.tags && workOrder.tags.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {workOrder.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Clock className="w-4 h-4" />
                Status
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Timer className="w-4 h-4" />
                Time & Cost
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquare className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <TabsContent value="overview" className="p-4 m-0">
                <EnhancedChecklist workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="status" className="p-4 m-0">
                <WorkOrderStatusFlow workOrder={workOrder} />
              </TabsContent>

              <TabsContent value="time" className="p-4 m-0">
                <TimeAndCostTracking workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="activity" className="p-4 m-0">
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">No comments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Comments and activity logs will appear here</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
