
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
    <SidebarContent className="p-0 bg-white">
      {Object.entries(groupedItems).map(([group, items]) => (
        <SidebarGroup key={group} className="px-3 py-0 mb-0">
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-bold tracking-widest px-0 py-3 mb-0">
            {t(group as keyof typeof t)}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="space-y-1 mb-4">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title} className="m-0">
                    <SidebarMenuButton 
                      asChild
                      className={`
                        relative group h-9 px-3 rounded-lg transition-all duration-200 m-0
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-700 shadow-sm' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-3 w-full">
                        <div className={`
                          w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
                          }
                        `}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-sm tracking-wide">{t(item.title as keyof typeof t)}</span>
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
