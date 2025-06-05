
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your maintenance overview.</p>
          </div>
        </div>
        
        <DashboardMetrics />
      </div>
    </DashboardLayout>
  );
}
