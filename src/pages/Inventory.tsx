
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";

export default function Inventory() {
  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageContent>
          <InventoryDashboard />
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
}
