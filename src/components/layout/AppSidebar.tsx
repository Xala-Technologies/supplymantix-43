import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  WorkflowIcon,
  ShoppingCartIcon,
  ClipboardListIcon,
  PackageIcon,
  MessageSquareIcon,
  MapPinIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  CalendarIcon,
  GaugeIcon,
  CogIcon,
  FileTextIcon,
  ArchiveIcon,
} from "lucide-react";

const menuItems = [
  {
    title: "Work Orders",
    url: "/dashboard/work-orders",
    icon: WorkflowIcon,
    badge: "9",
  },
  {
    title: "Purchase Orders", 
    url: "/dashboard/purchase-orders",
    icon: ShoppingCartIcon,
  },
  {
    title: "Reporting",
    url: "/dashboard/reporting", 
    icon: BarChart3Icon,
  },
  {
    title: "Requests",
    url: "/dashboard/requests",
    icon: ClipboardListIcon,
  },
  {
    title: "Assets",
    url: "/dashboard/assets",
    icon: PackageIcon,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageSquareIcon,
    badge: "1",
  },
  {
    title: "Categories",
    url: "/dashboard/categories", 
    icon: ArchiveIcon,
  },
  {
    title: "Parts Inventory",
    url: "/dashboard/inventory",
    icon: PackageIcon,
  },
  {
    title: "Library", 
    url: "/dashboard/library",
    icon: FileTextIcon,
  },
  {
    title: "Meters",
    url: "/dashboard/meters",
    icon: GaugeIcon,
  },
  {
    title: "Automations",
    url: "/dashboard/automations",
    icon: CogIcon,
  },
  {
    title: "Locations", 
    url: "/dashboard/locations",
    icon: MapPinIcon,
  },
  {
    title: "Teams / Users",
    url: "/dashboard/users",
    icon: UsersIcon,
  },
  {
    title: "Vendors",
    url: "/dashboard/vendors", 
    icon: UsersIcon,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-bold text-lg">
            X
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg">Maintainx</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}