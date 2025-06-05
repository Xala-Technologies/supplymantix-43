
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PurchaseOrderStatusBadgeProps {
  status: string;
  createdAt: string;
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'approved':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'ordered':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'received':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export const PurchaseOrderStatusBadge = ({ 
  status, 
  createdAt, 
  className 
}: PurchaseOrderStatusBadgeProps) => {
  const isOverdue = status !== 'received' && 
    new Date(createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant="secondary" 
        className={getStatusColor(status)}
      >
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
      {isOverdue && (
        <div className="flex items-center gap-1 text-red-600" title="Overdue (>30 days)">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Overdue</span>
        </div>
      )}
    </div>
  );
};
