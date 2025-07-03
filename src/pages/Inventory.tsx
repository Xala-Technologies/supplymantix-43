import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { PartsInventoryDashboard } from "@/components/inventory/InventoryDashboard";

export default function Inventory() {
  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageContent>
          <PartsInventoryDashboard />
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
}
