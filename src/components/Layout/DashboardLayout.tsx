
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { TopBar } from "@/components/Layout/TopBar";
import { Layout } from "./Layout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Layout className="bg-background">
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-[var(--sidebar-width)] md:peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-300 ease-linear">
            <TopBar />
            <main className="flex-1 overflow-hidden pt-16 transition-all duration-300 ease-linear bg-background">
              <div className="h-full w-full p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </Layout>
    </SidebarProvider>
  );
};
