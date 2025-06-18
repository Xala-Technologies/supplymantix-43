
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkOrder } from "@/types/workOrder";
import { format } from "date-fns";
import { getAssetName, getLocationName } from '@/utils/assetUtils';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onSelect: (id: string) => void;
  isSelected?: boolean;
}

export const WorkOrderCard = ({ workOrder, onSelect, isSelected = false }: WorkOrderCardProps) => {
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
      'urgent': 'bg-purple-500',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  const formatDueDate = (dateString: string) => {
    if (!dateString) return null;
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

  const dueDate = formatDueDate(workOrder.dueDate || workOrder.due_date || '');
  const isOverdue = dueDate?.color === 'text-red-600';

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        isSelected 
          ? "bg-blue-50 border-blue-300 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300",
        isOverdue && "ring-1 ring-red-200"
      )}
      onClick={() => onSelect(workOrder.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Priority Indicator & Icon */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">
                {workOrder.category === 'safety' ? '🔥' : 
                 workOrder.category === 'maintenance' ? '🔧' : 
                 workOrder.category === 'inspection' ? '🔍' : '⚙️'}
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
              {getAssetName(workOrder.asset)} • #{workOrder.id.slice(-6)}
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className={dueDate.color}>{dueDate.text}</span>
                  {isOverdue && <span className="text-red-600 font-medium">⚠️</span>}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{getLocationName(workOrder.location)}</span>
              </div>
            </div>
            
            {/* Assignee */}
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex items-center gap-1">
                {workOrder.assignedTo && workOrder.assignedTo.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <span className="text-xs text-gray-400">Unassigned</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            {workOrder.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {workOrder.description}
              </p>
            )}
            
            {/* Tags */}
            {workOrder.tags && workOrder.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {workOrder.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {workOrder.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{workOrder.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
