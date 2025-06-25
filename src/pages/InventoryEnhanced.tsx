
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from "@/components/Layout/StandardPageLayout";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { Package } from "lucide-react";

export default function InventoryEnhanced() {
  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageHeader
          title="Inventory Management"
          description="Manage your inventory items, track stock levels, and monitor usage"
          leftContent={
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          }
        />
        
        <StandardPageContent>
          <InventoryDashboard />
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
}
