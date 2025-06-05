
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ReportingHeader } from "@/components/reporting/ReportingHeader";
import { ReportsDashboard } from "@/components/reporting/ReportsDashboard";
import { ReportBuilder } from "@/components/reporting/ReportBuilder";

const Reporting = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ReportingHeader 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "dashboard" && <ReportsDashboard />}
        {activeTab === "builder" && <ReportBuilder />}
      </div>
    </DashboardLayout>
  );
};

export default Reporting;
