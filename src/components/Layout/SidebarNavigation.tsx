
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
    <SidebarContent className="p-0 bg-white overflow-hidden">
      {Object.entries(groupedItems).map(([group, items]) => (
        <SidebarGroup key={group} className="px-4 py-1 mb-1">
          <SidebarGroupLabel 
            className={`
              text-gray-500 uppercase text-xs font-bold tracking-widest px-0 py-2 mb-1
              transition-all duration-300 ease-in-out
              ${isCollapsed ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
            `}
          >
            {!isCollapsed && t(group as keyof typeof t)}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="space-y-1 mb-3">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title} className="m-0">
                    <SidebarMenuButton 
                      asChild
                      className={`
                        relative group h-9 px-3 rounded-xl transition-all duration-300 ease-in-out m-0
                        overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                        }
                        ${isCollapsed ? 'w-9 justify-center' : 'w-full'}
                      `}
                    >
                      <Link to={item.url} className={`
                        flex items-center w-full transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                      `}>
                        {/* Enhanced Icon Container */}
                        <div className={`
                          w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out
                          ${isActive 
                            ? 'bg-white/20 text-white shadow-sm' 
                            : 'bg-transparent text-gray-600 group-hover:text-blue-600 group-hover:bg-white/50'
                          }
                        `}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        {/* Enhanced Text with Animation */}
                        <span 
                          className={`
                            font-medium text-sm tracking-wide transition-all duration-300 ease-in-out
                            ${isCollapsed 
                              ? 'opacity-0 scale-75 w-0 overflow-hidden' 
                              : 'opacity-100 scale-100 flex-1'
                            }
                          `}
                        >
                          {t(item.title as keyof typeof t)}
                        </span>
                        
                        {/* Enhanced Active Indicator */}
                        {isActive && (
                          <div className={`
                            absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm
                            transition-all duration-300 ease-in-out
                            ${isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                          `}></div>
                        )}
                        
                        {/* Hover Effect Overlay */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out
                          ${isActive ? 'hidden' : ''}
                        `}></div>
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
