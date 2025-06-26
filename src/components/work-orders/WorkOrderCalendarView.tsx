
import { useState } from "react";
import { WorkOrder } from "@/features/workOrders/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { workOrdersApi } from "@/lib/database/work-orders";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WORK_ORDER_QUERY_KEYS } from "@/features/workOrders/constants";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { WeekdayHeader } from "./calendar/WeekdayHeader";
import { CalendarDay } from "./calendar/CalendarDay";
import { CalendarLegend } from "./calendar/CalendarLegend";

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
      <CalendarHeader
        currentDate={currentDate}
        onNavigateMonth={navigateMonth}
        onGoToToday={goToToday}
      />

      <div className="flex-1 p-6">
        <WeekdayHeader />

        <div className="grid grid-cols-7 gap-2" style={{ height: 'calc(100% - 80px)' }}>
          {calendarDays.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              currentDate={currentDate}
              workOrders={getWorkOrdersForDay(day)}
              selectedWorkOrderId={selectedWorkOrderId}
              onSelectWorkOrder={onSelectWorkOrder}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <CalendarLegend />
    </div>
  );
};
