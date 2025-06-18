
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
import { groupedItems } from "./sidebarMenuItems";

export function SidebarNavigation() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <SidebarContent className="px-3 py-2 bg-white">
      {Object.entries(groupedItems).map(([group, items]) => (
        <SidebarGroup key={group} className="mb-0.5">
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-1 px-2">
            {t(group as keyof typeof t)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        relative group h-9 px-3 rounded-lg transition-all duration-300 ease-out
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-700 shadow-sm' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-3 w-full">
                        <div className={`
                          w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-blue-500/30' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
                          }
                        `}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-base tracking-wide">{t(item.title as keyof typeof t)}</span>
                        {isActive && (
                          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 shadow-sm shadow-blue-400/50"></div>
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
