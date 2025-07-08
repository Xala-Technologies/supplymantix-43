
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface InventoryStatusBadgeProps {
  quantity: number;
  minQuantity?: number | null;
  className?: string;
}

export const InventoryStatusBadge = ({ 
  quantity, 
  minQuantity, 
  className 
}: InventoryStatusBadgeProps) => {
  const isLowStock = minQuantity && quantity <= minQuantity;

  if (isLowStock) {
    return (
      <Badge 
        variant="destructive" 
        className={`gap-1 ${className}`}
      >
        <AlertTriangle className="h-3 w-3" />
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className={`gap-1 bg-success-50 text-success-600 hover:bg-success-100 ${className}`}
    >
      <CheckCircle className="h-3 w-3" />
      In Stock
    </Badge>
  );
};
