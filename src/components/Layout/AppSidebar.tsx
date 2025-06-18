
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { AppSidebarFooter } from "./SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0 bg-white shadow-lg">
      <AppSidebarHeader />
      <SidebarNavigation />
      <AppSidebarFooter />
    </Sidebar>
  );
}
