
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
      'draft': 'bg-slate-50 text-slate-600 border-slate-200',
      'open': 'bg-sky-50 text-sky-700 border-sky-200',
      'in_progress': 'bg-amber-50 text-amber-700 border-amber-200',
      'on_hold': 'bg-orange-50 text-orange-700 border-orange-200',
      'completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-rose-50 text-rose-700 border-rose-200',
      'archived': 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-slate-600 bg-slate-50 border-slate-200',
      'medium': 'text-blue-600 bg-blue-50 border-blue-200',
      'high': 'text-amber-600 bg-amber-50 border-amber-200',
      'urgent': 'text-rose-600 bg-rose-50 border-rose-200',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const isOverdue = workOrder.due_date && new Date(workOrder.due_date) < new Date() && workOrder.status !== 'completed';

  return (
    <div className="h-full overflow-auto">
      <Card className="h-full border-0 shadow-none rounded-none bg-white">
        {/* Elegant Header with Soft Blue Gradient */}
        <CardHeader className="bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-light tracking-wide text-slate-700">{workOrder.title}</CardTitle>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0 bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-700 backdrop-blur-sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200">
                  <FileText className="w-4 h-4" />
                  #{workOrder.id.slice(-8)}
                </span>
                <span className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200">
                  <MapPin className="w-4 h-4" />
                  {getAssetName(workOrder.asset)}
                </span>
                {workOrder.location && (
                  <span className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-200">
                    <MapPin className="w-4 h-4" />
                    {getLocationName(workOrder.location)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className={`border ${getStatusColor(workOrder.status)} font-medium px-3 py-1`}>
                  {workOrder.status.replace('_', ' ')}
                </Badge>
                <Badge className={`border ${getPriorityColor(workOrder.priority)} font-medium px-3 py-1`}>
                  {workOrder.priority} priority
                </Badge>
                {isOverdue && (
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium px-3 py-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {workOrder.description && (
            <div className="bg-white/50 rounded-2xl p-6 border border-slate-200 mt-6 backdrop-blur-sm">
              <h3 className="font-medium text-slate-600 mb-3 text-lg">Description</h3>
              <p className="text-slate-600 leading-relaxed">{workOrder.description}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-8">
          {/* Refined Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {workOrder.due_date && (
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Due Date</div>
                  <div className={`text-sm ${isOverdue ? "text-rose-600" : "text-slate-500"}`}>
                    {new Date(workOrder.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-3 bg-sky-100 rounded-xl">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">Assigned To</div>
                <div className="text-sm text-slate-500">
                  {workOrder.assignedTo?.length > 0 ? workOrder.assignedTo.join(', ') : 'Unassigned'}
                </div>
              </div>
            </div>
            
            {workOrder.category && (
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Tag className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Category</div>
                  <div className="text-sm text-slate-500 capitalize">{workOrder.category}</div>
                </div>
              </div>
            )}

            {(workOrder.time_spent || workOrder.timeSpent) && (
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Timer className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Time Spent</div>
                  <div className="text-sm text-slate-500">
                    {workOrder.time_spent || workOrder.timeSpent} hours
                  </div>
                </div>
              </div>
            )}

            {(workOrder.total_cost || workOrder.totalCost) && (
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <div className="w-5 h-5 text-amber-600 flex items-center justify-center font-bold text-sm">$</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Total Cost</div>
                  <div className="text-sm text-slate-500">
                    ${(workOrder.total_cost || workOrder.totalCost)?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Elegant Tags Section */}
          {workOrder.tags && workOrder.tags.length > 0 && (
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-5 h-5 text-slate-400" />
                <span className="font-semibold text-slate-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {workOrder.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Refined Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
              <TabsTrigger value="overview" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700 text-slate-500">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700 text-slate-500">
                <Clock className="w-4 h-4" />
                Status
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700 text-slate-500">
                <Timer className="w-4 h-4" />
                Time & Cost
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700 text-slate-500">
                <MessageSquare className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <TabsContent value="overview" className="p-6 m-0">
                <EnhancedChecklist workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="status" className="p-6 m-0">
                <WorkOrderStatusFlow workOrder={workOrder} />
              </TabsContent>

              <TabsContent value="time" className="p-6 m-0">
                <TimeAndCostTracking workOrderId={workOrder.id} />
              </TabsContent>

              <TabsContent value="activity" className="p-6 m-0">
                <div className="text-center py-16 text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-600 mb-2">No activity yet</p>
                  <p className="text-sm text-slate-400">Comments and activity logs will appear here</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
