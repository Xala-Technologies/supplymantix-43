
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Users, MapPin, Search, Filter, Plus, ChevronDown } from "lucide-react";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";
import { getStatusColor, getPriorityColor, formatDueDate } from "@/services/workOrderService";
import { getAssetName, getLocationName } from '@/utils/assetUtils';
import { useState } from "react";

interface EnhancedWorkOrdersListProps {
  workOrders: WorkOrder[];
  selectedWorkOrderId: string | null;
  onSelectWorkOrder: (id: string) => void;
  onCreateWorkOrder?: () => void;
}

export const EnhancedWorkOrdersList = ({ 
  workOrders, 
  selectedWorkOrderId, 
  onSelectWorkOrder,
  onCreateWorkOrder 
}: EnhancedWorkOrdersListProps) => {
  const [filters, setFilters] = useState<WorkOrderFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Filter work orders
  const filteredWorkOrders = workOrders.filter(wo => {
    if (filters.search && !wo.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !wo.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && wo.status !== filters.status) return false;
    if (filters.priority !== 'all' && wo.priority !== filters.priority) return false;
    if (filters.category !== 'all' && wo.category !== filters.category) return false;
    return true;
  });

  const activeWorkOrders = filteredWorkOrders.filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Work Orders</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {filteredWorkOrders.length} of {workOrders.length} orders
            </p>
          </div>
          {onCreateWorkOrder && (
            <Button onClick={onCreateWorkOrder} size="sm" className="gap-1.5 h-8 px-3">
              <Plus className="w-3.5 h-3.5" />
              New
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <Input
            placeholder="Search work orders..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-8 h-8 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-7 px-2"
        >
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs">Filters</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilters && "rotate-180")} />
        </Button>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Priority</label>
                <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Work Orders List */}
      <div className="flex-1 overflow-y-auto">
        {filteredWorkOrders.length > 0 ? (
          <div className="p-3 space-y-2">
            {filteredWorkOrders.map((workOrder) => (
              <WorkOrderCard
                key={workOrder.id}
                workOrder={workOrder}
                isSelected={selectedWorkOrderId === workOrder.id}
                onClick={() => onSelectWorkOrder(workOrder.id)}
                getInitials={getInitials}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No work orders found</h3>
              <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  isSelected: boolean;
  onClick: () => void;
  getInitials: (name: string) => string;
}

const WorkOrderCard = ({ workOrder, isSelected, onClick, getInitials }: WorkOrderCardProps) => {
  const isOverdue = new Date(workOrder.dueDate || workOrder.due_date || '') < new Date() && workOrder.status !== 'completed';
  
  return (
    <div
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-blue-50 border-blue-200 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
        isOverdue && "ring-1 ring-red-200"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", getPriorityColor(workOrder.priority))} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-0.5">
              {workOrder.title}
            </h4>
            <p className="text-xs text-gray-600">
              {getAssetName(workOrder.asset)} • #{workOrder.id.slice(-4)}
            </p>
          </div>
        </div>
        
        {/* Status and Due Date */}
        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs h-5 px-2", getStatusColor(workOrder.status))}>
            {workOrder.status.replace('_', ' ')}
          </Badge>
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-red-600" : "text-gray-500"
          )}>
            <Clock className="w-3 h-3" />
            <span>{formatDueDate(workOrder.dueDate || workOrder.due_date || '')}</span>
            {isOverdue && <span className="text-red-600">⚠️</span>}
          </div>
        </div>
        
        {/* Location and Assignees */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{getLocationName(workOrder.location)}</span>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Users className="w-3 h-3 text-gray-400" />
            {workOrder.assignedTo.slice(0, 2).map((assignee, index) => (
              <Avatar key={index} className="w-4 h-4 border border-white">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                  {getInitials(assignee)}
                </AvatarFallback>
              </Avatar>
            ))}
            {workOrder.assignedTo.length > 2 && (
              <span className="text-gray-500 ml-0.5">+{workOrder.assignedTo.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
