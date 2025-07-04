
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LowStockBannerProps {
  inventoryItem: {
    id: string;
    name: string;
    quantity: number;
    min_quantity: number | null;
  };
}

export const LowStockBanner = ({ inventoryItem }: LowStockBannerProps) => {
  const navigate = useNavigate();
  
  if (!inventoryItem.min_quantity || inventoryItem.quantity > inventoryItem.min_quantity) {
    return null;
  }

  const handleCreatePO = () => {
    const reorderQuantity = Math.max(
      (inventoryItem.min_quantity! * 2) - inventoryItem.quantity,
      1
    );
    
    navigate(`/dashboard/purchase-orders/create?inventory_item_id=${inventoryItem.id}&quantity=${reorderQuantity}`);
  };

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-800">
          ⚠ Low stock for this item. Current: {inventoryItem.quantity}, Minimum: {inventoryItem.min_quantity}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCreatePO}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Create PO
        </Button>
      </AlertDescription>
    </Alert>
  );
};
