
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  ShoppingCart, 
  Package, 
  XCircle 
} from "lucide-react";
import type { PurchaseOrderStatus } from "@/types/purchaseOrder";

interface PurchaseOrderStatusBadgeProps {
  status: PurchaseOrderStatus;
  className?: string;
}

export const PurchaseOrderStatusBadgeEnhanced = ({ 
  status, 
  className 
}: PurchaseOrderStatusBadgeProps) => {
  const getStatusConfig = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'draft':
        return {
          variant: 'secondary' as const,
          icon: FileText,
          label: 'Draft',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
      case 'pending':
        return {
          variant: 'default' as const,
          icon: Clock,
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
      case 'approved':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          label: 'Approved',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'ordered':
        return {
          variant: 'default' as const,
          icon: ShoppingCart,
          label: 'Ordered',
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        };
      case 'received':
        return {
          variant: 'success' as const,
          icon: Package,
          label: 'Received',
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'cancelled':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: FileText,
          label: status,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`gap-1 ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
