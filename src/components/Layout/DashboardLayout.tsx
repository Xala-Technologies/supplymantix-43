
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
      <div className="min-h-screen flex w-full bg-gray-50/30 transition-all duration-300 ease-linear">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-linear">
          <TopBar />
          <main className="flex-1 overflow-hidden pt-16 transition-all duration-300 ease-linear">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
