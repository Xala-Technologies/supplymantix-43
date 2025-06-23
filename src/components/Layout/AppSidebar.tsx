
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
      border-r-0 bg-white shadow-xl relative z-40 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-72'}
    `}>
      <SidebarHeader className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'px-2' : 'px-4'}
      `}>
        <AppSidebarHeader />
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <SidebarNavigation />
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className={`
        transition-all duration-300 ease-in-out border-t border-gray-100
        ${isCollapsed ? 'px-2' : 'px-4'}
      `}>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
