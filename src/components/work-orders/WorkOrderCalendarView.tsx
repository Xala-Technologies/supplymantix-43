
import { useState, useCallback } from "react";
import { WorkOrder } from "@/features/workOrders/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, parseISO, startOfWeek, endOfWeek, isSameMonth } from "date-fns";
import { workOrdersApi } from "@/lib/database/work-orders";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WORK_ORDER_QUERY_KEYS } from "@/features/workOrders/constants";
import { getPriorityColor, getStatusColor } from "@/features/workOrders/utils";

interface WorkOrderCalendarViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId: string | null;
}

export const WorkOrderCalendarView = ({ 
  workOrders, 
  onSelectWorkOrder, 
  selectedWorkOrderId
}: WorkOrderCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedWorkOrder, setDraggedWorkOrder] = useState<WorkOrder | null>(null);
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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

      await queryClient.invalidateQueries({ queryKey: WORK_ORDER_QUERY_KEYS.all });

      toast.success(`Work order moved to ${format(targetDate, 'MMM dd, yyyy')}`);
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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              className="hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              className="hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-primary"
        >
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2" style={{ height: 'calc(100% - 80px)' }}>
          {calendarDays.map((day, index) => {
            const dayWorkOrders = getWorkOrdersForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                className={`
                  min-h-[140px] p-3 rounded-xl border transition-all duration-200 hover:shadow-md
                  ${isCurrentDay 
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-lg' 
                    : isCurrentMonth
                      ? 'bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white'
                      : 'bg-slate-50/50 border-slate-100 text-slate-400'
                  }
                `}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-bold mb-3 ${
                  isCurrentDay 
                    ? 'text-blue-700' 
                    : isCurrentMonth 
                      ? 'text-slate-800' 
                      : 'text-slate-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[100px]">
                  {dayWorkOrders.map(workOrder => (
                    <div
                      key={workOrder.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, workOrder)}
                      onClick={() => onSelectWorkOrder(workOrder.id)}
                      className={`
                        cursor-pointer p-2 rounded-lg border-l-4 bg-white/90 backdrop-blur-sm
                        hover:bg-white hover:shadow-md text-xs transition-all duration-200
                        ${getStatusColor(workOrder.status).replace('bg-', 'border-l-')}
                        ${selectedWorkOrderId === workOrder.id ? 'ring-2 ring-blue-400 bg-blue-50/80' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          className={`text-xs px-1.5 py-0.5 ${getPriorityColor(workOrder.priority)}`}
                        >
                          {workOrder.priority}
                        </Badge>
                      </div>
                      <div className="font-medium text-slate-900 truncate text-xs" title={workOrder.title}>
                        {workOrder.title}
                      </div>
                      {workOrder.assignedTo && workOrder.assignedTo.length > 0 && (
                        <div className="text-slate-600 truncate text-xs mt-1">
                          {workOrder.assignedTo[0]}
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

      {/* Enhanced Legend */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-slate-500 bg-white rounded"></div>
              <span className="text-slate-600 font-medium">Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-blue-500 bg-white rounded"></div>
              <span className="text-slate-600 font-medium">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-green-500 bg-white rounded"></div>
              <span className="text-slate-600 font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-yellow-500 bg-white rounded"></div>
              <span className="text-slate-600 font-medium">On Hold</span>
            </div>
          </div>
          <div className="text-slate-500 font-medium">
            💡 Drag work orders to change due dates
          </div>
        </div>
      </div>
    </div>
  );
};
