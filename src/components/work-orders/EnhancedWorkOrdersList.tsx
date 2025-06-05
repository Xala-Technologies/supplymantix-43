
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Users, MapPin, Search, Filter, Plus } from "lucide-react";
import { WorkOrder, WorkOrderFilters } from "@/types/workOrder";
import { getStatusColor, getPriorityColor, formatDueDate } from "@/services/workOrderService";
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

  // Filter work orders based on current filters
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

  // Group work orders
  const activeWorkOrders = filteredWorkOrders.filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled');
  const myWorkOrders = activeWorkOrders.slice(0, Math.ceil(activeWorkOrders.length / 2));
  const teamWorkOrders = activeWorkOrders.slice(Math.ceil(activeWorkOrders.length / 2));

  return (
    <div className="w-full md:w-80 lg:w-96 xl:w-[28rem] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header with Search and Filters */}
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Work Orders</h2>
          {onCreateWorkOrder && (
            <Button size="sm" onClick={onCreateWorkOrder} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search work orders..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-9"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Active: {activeWorkOrders.length}</span>
            <span>•</span>
            <span>Total: {workOrders.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Priority" />
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
        )}
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* My Work Orders */}
        {myWorkOrders.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Assigned to Me ({myWorkOrders.length})
            </h3>
            
            <div className="space-y-3">
              {myWorkOrders.map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  isSelected={selectedWorkOrderId === workOrder.id}
                  onClick={() => onSelectWorkOrder(workOrder.id)}
                  getInitials={getInitials}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Team Work Orders */}
        {teamWorkOrders.length > 0 && (
          <div className="px-4 pb-4">
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Team Orders ({teamWorkOrders.length})
              </h3>
              
              <div className="space-y-3">
                {teamWorkOrders.map((workOrder) => (
                  <WorkOrderCard
                    key={workOrder.id}
                    workOrder={workOrder}
                    isSelected={selectedWorkOrderId === workOrder.id}
                    onClick={() => onSelectWorkOrder(workOrder.id)}
                    getInitials={getInitials}
                    isTeam
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredWorkOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">No work orders found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
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
  isTeam?: boolean;
}

const WorkOrderCard = ({ workOrder, isSelected, onClick, getInitials, isTeam = false }: WorkOrderCardProps) => {
  const isOverdue = new Date(workOrder.dueDate) < new Date() && workOrder.status !== 'completed';
  
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected 
          ? "bg-blue-50 border-blue-300 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300",
        isTeam && "bg-gray-50 hover:bg-gray-100",
        isOverdue && "ring-1 ring-red-200"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Priority Indicator & Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isTeam ? "bg-gray-200" : "bg-gradient-to-br from-blue-50 to-blue-100"
          )}>
            <span className="text-sm">
              {workOrder.category === 'safety' ? '🔥' : 
               workOrder.category === 'maintenance' ? '🔧' : 
               workOrder.category === 'inspection' ? '🔍' : '⚙️'}
            </span>
          </div>
          <div className={cn("w-3 h-3 rounded-full", getPriorityColor(workOrder.priority))} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight pr-2 line-clamp-2">
              {workOrder.title}
            </h4>
          </div>
          
          {/* Asset and ID */}
          <div className="text-xs text-gray-600 mb-2 truncate">
            {workOrder.asset.name} • #{workOrder.id.slice(-4)}
          </div>
          
          {/* Status and Due Date */}
          <div className="flex flex-col gap-2 mb-3">
            <Badge className={cn("text-xs w-fit border", getStatusColor(workOrder.status))}>
              {workOrder.status.replace('_', ' ')}
            </Badge>
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-600" : "text-gray-500"
            )}>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDueDate(workOrder.dueDate)}</span>
              {isOverdue && <span className="text-red-600 font-medium">⚠️</span>}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{workOrder.location}</span>
            </div>
          </div>
          
          {/* Assigned Users */}
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-1 min-w-0">
              {workOrder.assignedTo.slice(0, 2).map((assignee, index) => (
                <Avatar key={index} className="w-6 h-6 border border-white flex-shrink-0">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                    {getInitials(assignee)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {workOrder.assignedTo.length > 2 && (
                <span className="text-xs text-gray-500 ml-1">+{workOrder.assignedTo.length - 2}</span>
              )}
              {workOrder.assignedTo.length === 0 && (
                <span className="text-xs text-gray-400">Unassigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
