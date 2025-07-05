
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { AppSidebarFooter } from "./SidebarFooter";
import { useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={`
      border-r border-sidebar-border bg-sidebar shadow-sm relative z-40 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-72'}
    `}>
      <AppSidebarHeader />
      
      <ScrollArea className="flex-1 mt-16">
        <SidebarContent className="flex-1 p-4">
          <SidebarNavigation />
        </SidebarContent>
      </ScrollArea>
      
      <SidebarFooter className={`
        transition-all duration-300 ease-in-out border-t border-sidebar-border bg-sidebar
        ${isCollapsed ? 'px-2' : 'px-4'}
      `}>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
