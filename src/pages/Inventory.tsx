
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";

export default function Inventory() {
  return (
    <DashboardLayout>
      <div className="h-full bg-gray-50">
        <InventoryDashboard />
      </div>
    </DashboardLayout>
  );
}
