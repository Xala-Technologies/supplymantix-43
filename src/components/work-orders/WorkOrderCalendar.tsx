
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface WorkOrderCalendarProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (id: string) => void;
  selectedWorkOrderId?: string;
}

export const WorkOrderCalendar = ({ 
  workOrders, 
  onSelectWorkOrder, 
  selectedWorkOrderId 
}: WorkOrderCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWorkOrdersForDate = (date: Date) => {
    return workOrders.filter(wo => {
      const dueDate = new Date(wo.dueDate || wo.due_date || '');
      return isSameDay(dueDate, date);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm p-2">
              {day.substring(0, 3).toUpperCase()}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 flex-1">
          {days.map(day => {
            const dayWorkOrders = getWorkOrdersForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] p-2 border rounded-lg",
                  isCurrentMonth ? "bg-white" : "bg-gray-50",
                  isToday && "ring-2 ring-blue-500"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  isToday && "text-blue-600"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayWorkOrders.slice(0, 3).map(workOrder => (
                    <div
                      key={workOrder.id}
                      className={cn(
                        "text-xs p-1 rounded border-l-2 cursor-pointer truncate",
                        getPriorityColor(workOrder.priority),
                        selectedWorkOrderId === workOrder.id && "ring-1 ring-blue-300"
                      )}
                      onClick={() => onSelectWorkOrder(workOrder.id)}
                      title={workOrder.title}
                    >
                      {workOrder.title}
                    </div>
                  ))}
                  {dayWorkOrders.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayWorkOrders.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
