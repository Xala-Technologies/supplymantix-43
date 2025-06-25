
import { useState, useCallback } from "react";
import { WorkOrder } from "@/types/workOrder";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, parseISO } from "date-fns";
import { workOrdersApi } from "@/lib/database/work-orders";
import { toast } from "sonner";

interface WorkOrderCalendarViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId: string | null;
  onRefetch: () => void;
}

export const WorkOrderCalendarView = ({ 
  workOrders, 
  onSelectWorkOrder, 
  selectedWorkOrderId,
  onRefetch 
}: WorkOrderCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedWorkOrder, setDraggedWorkOrder] = useState<WorkOrder | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get work orders for a specific day
  const getWorkOrdersForDay = (day: Date) => {
    return workOrders.filter(wo => {
      if (!wo.dueDate && !wo.due_date) return false;
      const dueDate = wo.dueDate || wo.due_date;
      try {
        const workOrderDate = new Date(dueDate);
        return isSameDay(workOrderDate, day);
      } catch {
        return false;
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-l-green-500';
      case 'in_progress': return 'border-l-blue-500';
      case 'on_hold': return 'border-l-yellow-500';
      case 'open': return 'border-l-gray-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleDragStart = (e: React.DragEvent, workOrder: WorkOrder) => {
    setDraggedWorkOrder(workOrder);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    
    if (!draggedWorkOrder) return;

    try {
      const newDueDate = format(targetDate, 'yyyy-MM-dd');
      
      await workOrdersApi.updateWorkOrder(draggedWorkOrder.id, {
        due_date: newDueDate
      });

      toast.success(`Work order moved to ${format(targetDate, 'MMM dd, yyyy')}`);
      onRefetch();
    } catch (error) {
      console.error('Error updating work order date:', error);
      toast.error('Failed to update work order date');
    }

    setDraggedWorkOrder(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden" style={{ height: 'calc(100% - 50px)' }}>
          {monthDays.map((day, index) => {
            const dayWorkOrders = getWorkOrdersForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[120px] flex flex-col ${
                  isCurrentDay ? 'bg-blue-50 border-2 border-blue-200' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {dayWorkOrders.map(workOrder => (
                    <div
                      key={workOrder.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, workOrder)}
                      onClick={() => onSelectWorkOrder(workOrder.id)}
                      className={`
                        cursor-pointer p-2 rounded border-l-4 bg-gray-50 hover:bg-gray-100 
                        text-xs transition-colors duration-200
                        ${getStatusColor(workOrder.status)}
                        ${selectedWorkOrderId === workOrder.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          className={`text-xs px-1 py-0 ${getPriorityColor(workOrder.priority)}`}
                        >
                          {workOrder.priority}
                        </Badge>
                      </div>
                      <div className="font-medium text-gray-900 truncate" title={workOrder.title}>
                        {workOrder.title}
                      </div>
                      {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
                        <div className="text-gray-600 truncate">
                          Assigned to: {workOrder.assignedTo[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t p-4">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-l-gray-500 bg-gray-50"></div>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-l-blue-500 bg-gray-50"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-l-green-500 bg-gray-50"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-l-yellow-500 bg-gray-50"></div>
            <span>On Hold</span>
          </div>
          <span className="ml-4 text-gray-500">• Drag work orders to change dates</span>
        </div>
      </div>
    </div>
  );
};
