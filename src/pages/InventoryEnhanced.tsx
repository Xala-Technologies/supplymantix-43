
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { PageLayout, PageLayoutHeader, PageLayoutContent } from "@/components/Layout/PageLayout";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import { Package } from "lucide-react";

export default function InventoryEnhanced() {
  return (
    <DashboardLayout>
      <PageLayout>
        <PageLayoutHeader
          title="Inventory Management"
          description="Manage your inventory items, track stock levels, and monitor usage"
          leftContent={
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          }
        />
        
        <PageLayoutContent className="p-6">
          <InventoryDashboard />
        </PageLayoutContent>
      </PageLayout>
    </DashboardLayout>
  );
}
