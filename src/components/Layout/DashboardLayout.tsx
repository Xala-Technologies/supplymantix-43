
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { TopBar } from "@/components/Layout/TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-linear peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)]">
          <TopBar />
          <main className="flex-1 overflow-hidden pt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
