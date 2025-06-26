
import { format, isToday, isSameMonth } from "date-fns";
import { WorkOrder } from "@/features/workOrders/types";
import { WorkOrderItem } from "./WorkOrderItem";

interface CalendarDayProps {
  day: Date;
  currentDate: Date;
  workOrders: WorkOrder[];
  selectedWorkOrderId: string | null;
  onSelectWorkOrder: (id: string) => void;
  onDragStart: (e: React.DragEvent, workOrder: WorkOrder) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: Date) => void;
}

export const CalendarDay = ({
  day,
  currentDate,
  workOrders,
  selectedWorkOrderId,
  onSelectWorkOrder,
  onDragStart,
  onDragOver,
  onDrop
}: CalendarDayProps) => {
  const isCurrentDay = isToday(day);
  const isCurrentMonth = isSameMonth(day, currentDate);

  return (
    <div
      className={`
        min-h-[140px] p-3 rounded-xl border transition-all duration-200 hover:shadow-md
        ${isCurrentDay 
          ? 'bg-blue-50 border-2 border-blue-300 shadow-lg' 
          : isCurrentMonth
            ? 'bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white'
            : 'bg-slate-50/50 border-slate-100 text-slate-400'
        }
      `}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day)}
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
        {workOrders.map(workOrder => (
          <WorkOrderItem
            key={workOrder.id}
            workOrder={workOrder}
            isSelected={selectedWorkOrderId === workOrder.id}
            onSelect={onSelectWorkOrder}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
