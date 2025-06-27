
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { WorkOrdersPageRefactored } from "@/components/work-orders/WorkOrdersPageRefactored";

export default function WorkOrders() {
  return (
    <DashboardLayout>
      <WorkOrdersPageRefactored />
    </DashboardLayout>
  );
}
