
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/features/workOrders/types";
import { getPriorityColor, getStatusColor } from "@/features/workOrders/utils";

interface WorkOrderItemProps {
  workOrder: WorkOrder;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (e: React.DragEvent, workOrder: WorkOrder) => void;
}

export const WorkOrderItem = ({ workOrder, isSelected, onSelect, onDragStart }: WorkOrderItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, workOrder)}
      onClick={() => onSelect(workOrder.id)}
      className={`
        cursor-pointer p-2 rounded-lg border-l-4 bg-white/90 backdrop-blur-sm
        hover:bg-white hover:shadow-md text-xs transition-all duration-200
        ${getStatusColor(workOrder.status).replace('bg-', 'border-l-')}
        ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50/80' : ''}
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
  );
};
