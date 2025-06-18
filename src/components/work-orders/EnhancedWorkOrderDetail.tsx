
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
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50/50 to-white">
      <div className="space-y-4 p-4">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{workOrder.title}</h1>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0 border-gray-300 hover:border-blue-400 hover:bg-blue-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                  <FileText className="w-4 h-4" />
                  #{workOrder.id.slice(-8)}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {getAssetName(workOrder.asset)}
                </span>
                {workOrder.location && (
                  <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
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
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{workOrder.description}</p>
            </div>
          )}
        </div>

        {/* Enhanced Overview Card */}
        <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workOrder.due_date && (
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Due Date</div>
                    <div className={`text-sm ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                      {new Date(workOrder.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Assigned To</div>
                  <div className="text-sm text-gray-600">
                    {workOrder.assignedTo?.length > 0 ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                  </div>
                </div>
              </div>
              
              {workOrder.category && (
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Tag className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Category</div>
                    <div className="text-sm text-gray-600 capitalize">{workOrder.category}</div>
                  </div>
                </div>
              )}

              {(workOrder.time_spent || workOrder.timeSpent) && (
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Timer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Time Spent</div>
                    <div className="text-sm text-gray-600">
                      {workOrder.time_spent || workOrder.timeSpent} hours
                    </div>
                  </div>
                </div>
              )}

              {(workOrder.total_cost || workOrder.totalCost) && (
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <div className="w-5 h-5 text-emerald-600 flex items-center justify-center font-bold text-sm">$</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Total Cost</div>
                    <div className="text-sm text-gray-600">
                      ${(workOrder.total_cost || workOrder.totalCost)?.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Tags */}
            {workOrder.tags && workOrder.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">Tags</span>
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
          </CardContent>
        </Card>

        {/* Enhanced Tabbed Content */}
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

          <TabsContent value="overview" className="space-y-4">
            <EnhancedChecklist workOrderId={workOrder.id} />
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <WorkOrderStatusFlow workOrder={workOrder} />
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <TimeAndCostTracking workOrderId={workOrder.id} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-gray-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">No comments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Comments and activity logs will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
