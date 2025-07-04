
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PurchaseOrdersHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your purchase orders and vendor relationships
        </p>
      </div>
      <Button onClick={() => navigate("/dashboard/purchase-orders/create")}>
        <Plus className="mr-2 h-4 w-4" />
        New Purchase Order
      </Button>
    </div>
  );
};
