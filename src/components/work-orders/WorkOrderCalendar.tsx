
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
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
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getWorkOrdersForDate = (date: Date) => {
    return workOrders.filter(wo => {
      const dueDate = new Date(wo.dueDate || wo.due_date || '');
      return isSameDay(dueDate, date);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  return (
    <div className="h-full flex flex-col p-6">
      <Card className="flex-1 flex flex-col">
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
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500 text-sm p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {days.map(day => {
              const dayWorkOrders = getWorkOrdersForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[100px] p-2 border rounded",
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
                    {dayWorkOrders.slice(0, 2).map(workOrder => (
                      <div
                        key={workOrder.id}
                        className={cn(
                          "text-xs p-1 rounded cursor-pointer truncate flex items-center gap-1",
                          "bg-gray-100 hover:bg-gray-200",
                          selectedWorkOrderId === workOrder.id && "ring-1 ring-blue-300"
                        )}
                        onClick={() => onSelectWorkOrder(workOrder.id)}
                        title={workOrder.title}
                      >
                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(workOrder.priority))} />
                        <span className="truncate">{workOrder.title}</span>
                      </div>
                    ))}
                    {dayWorkOrders.length > 2 && (
                      <div className="text-xs text-gray-500 p-1">
                        +{dayWorkOrders.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
