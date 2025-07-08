
import { Link } from "react-router-dom";
import { SidebarHeader as BaseSidebarHeader } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Zap } from "lucide-react";

export function AppSidebarHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <BaseSidebarHeader className="h-16 p-4 border-b border-sidebar-border bg-sidebar relative z-50 fixed top-0 left-0 w-[var(--sidebar-width)] peer-data-[state=collapsed]:w-[var(--sidebar-width-icon)] transition-[width] duration-300 ease-linear">
      <Link to="/dashboard" className="flex items-center space-x-3 group transition-all duration-300 ease-in-out">
        <div className="relative">
          <div className={`
            rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-600 
            flex items-center justify-center shadow-lg shadow-primary/25
            transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30
            ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}
          `}>
            <Zap className={`text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </div>
        </div>
        <div className={`
          flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed 
            ? 'opacity-0 scale-75 w-0 overflow-hidden' 
            : 'opacity-100 scale-100 flex-1'
          }
        `}>
          <span className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
            SupplyMantix
          </span>
          <span className="text-xs text-text-tertiary font-semibold uppercase tracking-wider">
            Enterprise
          </span>
        </div>
      </Link>
    </BaseSidebarHeader>
  );
}
