
import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/components/ui/sidebar";
import { groupedItems } from "./sidebarMenuItems";

export function SidebarNavigation() {
  const location = useLocation();
  const { t } = useLanguage();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";

  return (
    <SidebarContent className="p-0 bg-sidebar overflow-hidden">
      {Object.entries(groupedItems).map(([group, items], groupIndex) => (
        <SidebarGroup key={group} className={`px-3 ${groupIndex === 0 ? 'pt-2' : 'pt-4'} pb-2`}>
          <SidebarGroupLabel 
            className={`
              text-text-secondary uppercase text-xs font-semibold tracking-wider px-2 py-2 mb-2
              transition-all duration-300 ease-in-out border-b border-sidebar-border/30
              ${isCollapsed ? 'opacity-0 scale-75 h-0 py-0 mb-0 border-b-0' : 'opacity-100 scale-100'}
            `}
          >
            {!isCollapsed && t(group as keyof typeof t)}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title} className="m-0">
                    <SidebarMenuButton 
                      asChild
                      tooltip={isCollapsed ? t(item.title as keyof typeof t) : undefined}
                      className={`
                        relative group h-10 px-3 rounded-lg transition-all duration-200 ease-in-out m-0
                        overflow-hidden border border-transparent
                        ${isActive 
                          ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' 
                          : 'text-text-secondary hover:bg-sidebar-item-hover hover:text-text-primary hover:border-sidebar-border'
                        }
                        ${isCollapsed ? 'w-10 justify-center mx-auto' : 'w-full'}
                      `}
                    >
                      <Link to={item.url} className={`
                        flex items-center w-full transition-all duration-200 ease-in-out
                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                      `}>
                        {/* Icon Container */}
                        <div className={`
                          w-5 h-5 flex items-center justify-center transition-all duration-200 ease-in-out
                          ${isActive 
                            ? 'text-primary' 
                            : 'text-text-secondary group-hover:text-text-primary'
                          }
                        `}>
                          <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        
                        {/* Text Label */}
                        <span 
                          className={`
                            font-medium text-sm transition-all duration-200 ease-in-out
                            ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}
                            ${isCollapsed 
                              ? 'opacity-0 scale-75 w-0 overflow-hidden' 
                              : 'opacity-100 scale-100 flex-1'
                            }
                          `}
                        >
                          {t(item.title as keyof typeof t)}
                        </span>
                        
                        {/* Active Indicator */}
                        {isActive && !isCollapsed && (
                          <div className="w-2 h-2 rounded-full bg-primary opacity-80"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
