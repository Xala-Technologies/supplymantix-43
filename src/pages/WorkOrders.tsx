
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { WorkOrdersPage } from "@/components/work-orders/WorkOrdersPage";

export default function WorkOrders() {
  return (
    <DashboardLayout>
      <WorkOrdersPage />
    </DashboardLayout>
  );
}
