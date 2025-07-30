
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/Layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { OverdueNotificationService } from "@/components/notifications/OverdueNotificationService";
import { Layout } from "./Layout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <OverdueNotificationService />
      <Layout className="bg-background">
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-300 ease-linear">
            <TopBar />
            <main className="flex-1 overflow-y-auto pt-16 transition-all duration-300 ease-linear bg-background">
              <div className="h-full w-full max-w-full px-spacing-md sm:px-spacing-lg lg:px-spacing-xl py-spacing-md">
                <div className="mx-auto max-w-7xl space-y-spacing-lg">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </SidebarProvider>
  );
};
