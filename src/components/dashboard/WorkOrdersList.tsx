import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Users, MapPin, Plus, Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkOrder } from "@/types/workOrder";
import { format } from "date-fns";
import { getAssetName, getLocationName } from '@/utils/assetUtils';

interface WorkOrdersListProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  onCreateWorkOrder: () => void;
  selectedWorkOrderId?: string;
}

export const WorkOrdersList = ({ 
  workOrders, 
  onSelectWorkOrder, 
  onCreateWorkOrder,
  selectedWorkOrderId 
}: WorkOrdersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('asc');

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-gray-100 text-gray-800 border-gray-300',
      'in_progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'on_hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'completed': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'high': 'bg-red-500',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
    
    return { 
      text: format(date, 'MMM dd, yyyy'), 
      color: 'text-gray-600' 
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'emergency': '🚨',
      'maintenance': '🔧',
      'repair': '🛠️',
      'inspection': '🔍',
      'calibration': '⚖️'
    };
    return icons[category.toLowerCase()] || '⚙️';
  };

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = React.useMemo(() => {
    const filtered = workOrders.filter(wo => {
      const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           wo.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date': {
          const aValue = new Date(a.dueDate || a.due_date || '').getTime();
          const bValue = new Date(b.dueDate || b.due_date || '').getTime();
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aValue = priorityOrder[a.priority];
          const bValue = priorityOrder[b.priority];
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        case 'status': {
          const aValue = a.status;
          const bValue = b.status;
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        case 'title': {
          const aValue = a.title.toLowerCase();
          const bValue = b.title.toLowerCase();
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
        default: {
          const aValue = new Date(a.createdAt || a.created_at || '').getTime();
          const bValue = new Date(b.createdAt || b.created_at || '').getTime();
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
      }
    });
  }, [workOrders, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            Work Orders
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filteredAndSortedWorkOrders.length}
            </Badge>
          </CardTitle>
          <Button onClick={onCreateWorkOrder} size="sm" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Work Order
          </Button>
        </div>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
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
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={`${sortBy}_${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('_');
            setSortBy(field);
            setSortOrder(order);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date_asc">Due Date (Earliest)</SelectItem>
              <SelectItem value="due_date_desc">Due Date (Latest)</SelectItem>
              <SelectItem value="priority_desc">Priority (High to Low)</SelectItem>
              <SelectItem value="priority_asc">Priority (Low to High)</SelectItem>
              <SelectItem value="title_asc">Title (A-Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="space-y-3 p-6">
          {filteredAndSortedWorkOrders.map((workOrder) => {
            const dueDate = formatDueDate(workOrder.dueDate || workOrder.due_date || '');
            const isSelected = selectedWorkOrderId === workOrder.id;
            
            return (
              <div
                key={workOrder.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                  isSelected 
                    ? "bg-blue-50 border-blue-300 shadow-sm" 
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectWorkOrder(workOrder.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Priority Indicator */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">
                        {getCategoryIcon(workOrder.category)}
                      </span>
                    </div>
                    <div className={cn("w-3 h-3 rounded-full", getPriorityColor(workOrder.priority))} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 pr-2">
                        {workOrder.title}
                      </h3>
                      <Badge className={cn("text-xs border", getStatusColor(workOrder.status))}>
                        {workOrder.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {/* Asset and ID */}
                    <div className="text-sm text-gray-600 mb-3">
                      {getAssetName(workOrder.asset)} • #{workOrder.id.slice(-4)}
                    </div>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className={dueDate.color}>{dueDate.text}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{getLocationName(workOrder.location)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex items-center gap-1">
                          {workOrder.assignedTo.slice(0, 2).map((assignee, index) => (
                            <Avatar key={index} className="w-5 h-5 border border-white">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                                {getInitials(assignee)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {workOrder.assignedTo.length > 2 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{workOrder.assignedTo.length - 2}
                            </span>
                          )}
                          {workOrder.assignedTo.length === 0 && (
                            <span className="text-xs text-gray-400">Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {workOrder.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredAndSortedWorkOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No work orders found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
