
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ReportingProvider } from "@/contexts/ReportingContext";
import { FilterBar } from "@/components/reporting/FilterBar";
import { WorkOrdersReportTab } from "@/components/reporting/WorkOrdersReportTab";
import { AssetHealthTab } from "@/components/reporting/AssetHealthTab";
import { RecentActivityTab } from "@/components/reporting/RecentActivityTab";
import { ExportDataTab } from "@/components/reporting/ExportDataTab";
import { CustomDashboardsTab } from "@/components/reporting/CustomDashboardsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Activity, Download, Layout, Database } from "lucide-react";

const Reporting = () => {
  const [activeTab, setActiveTab] = useState("work-orders");

  return (
    <ReportingProvider>
      <DashboardLayout>
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Reports & Analytics
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into your maintenance operations and performance metrics
                </p>
              </div>
            </div>

            {/* Global Filter Bar */}
            <FilterBar />
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 max-w-4xl">
              <TabsTrigger value="work-orders" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Work Orders
              </TabsTrigger>
              <TabsTrigger value="asset-health" className="gap-2">
                <Activity className="h-4 w-4" />
                Asset Health
              </TabsTrigger>
              <TabsTrigger value="recent-activity" className="gap-2">
                <Database className="h-4 w-4" />
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="export-data" className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </TabsTrigger>
              <TabsTrigger value="custom-dashboards" className="gap-2">
                <Layout className="h-4 w-4" />
                Custom Dashboards
              </TabsTrigger>
              <TabsTrigger value="reporting-details" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work-orders" className="space-y-4">
              <WorkOrdersReportTab />
            </TabsContent>

            <TabsContent value="asset-health" className="space-y-4">
              <AssetHealthTab />
            </TabsContent>

            <TabsContent value="recent-activity" className="space-y-4">
              <RecentActivityTab />
            </TabsContent>

            <TabsContent value="export-data" className="space-y-4">
              <ExportDataTab />
            </TabsContent>

            <TabsContent value="custom-dashboards" className="space-y-4">
              <CustomDashboardsTab />
            </TabsContent>

            <TabsContent value="reporting-details" className="space-y-4">
              <WorkOrdersReportTab />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ReportingProvider>
  );
};

export default Reporting;
