
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { AppSidebarFooter } from "./SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar className="sidebar-ultra-soft border-r-0 bg-white/95 backdrop-blur-xl shadow-xs">
      <AppSidebarHeader />
      <SidebarNavigation />
      <AppSidebarFooter />
    </Sidebar>
  );
}
