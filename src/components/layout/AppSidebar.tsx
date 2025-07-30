import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/Layout/SidebarHeader";
import { SidebarNavigation } from "@/components/Layout/SidebarNavigation";

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <AppSidebarHeader />
      <SidebarNavigation />
    </Sidebar>
  );
}