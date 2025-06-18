
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
    <SidebarContent className="px-2 sm:px-3 py-2 bg-transparent">
      {Object.entries(groupedItems).map(([group, items]) => (
        <SidebarGroup key={group} className="mb-1">
          <SidebarGroupLabel className="text-muted-foreground/70 uppercase text-2xs sm:text-xs font-bold tracking-widest mb-2 px-2 sm:px-3">
            {t(group as keyof typeof t)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        relative group h-9 sm:h-10 px-2 sm:px-3 rounded-xl transition-all duration-300 ease-out
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary/8 to-primary/5 text-primary shadow-xs border border-primary/10' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/40 hover:shadow-xs'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-2 sm:space-x-3 w-full min-w-0">
                        <div className={`
                          w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0
                          ${isActive 
                            ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-sm' 
                            : 'bg-muted/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
                          }
                        `}>
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm lg:text-base tracking-wide truncate">
                          {t(item.title as keyof typeof t)}
                        </span>
                        {isActive && (
                          <div className="absolute right-2 sm:right-3 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-sm"></div>
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
