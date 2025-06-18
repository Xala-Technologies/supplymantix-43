
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-responsive">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your maintenance overview.</p>
          </div>
        </div>
        
        <DashboardMetrics />
      </div>
    </DashboardLayout>
  );
}
