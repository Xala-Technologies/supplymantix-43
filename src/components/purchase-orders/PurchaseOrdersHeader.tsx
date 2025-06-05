
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "react-router-dom";

export const PurchaseOrdersHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your purchase orders and vendor relationships
        </p>
      </div>
      <Button onClick={() => router.push("/dashboard/purchase-orders/new")}>
        <Plus className="mr-2 h-4 w-4" />
        New Purchase Order
      </Button>
    </div>
  );
};
