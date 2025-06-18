
import { Link } from "react-router-dom";
import { SidebarHeader as BaseSidebarHeader } from "@/components/ui/sidebar";
import { Zap } from "lucide-react";

export function AppSidebarHeader() {
  return (
    <BaseSidebarHeader className="h-16 p-4 border-b border-sidebar-border bg-sidebar">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-sidebar-foreground">
            SupplyMantix
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Enterprise
          </span>
        </div>
      </Link>
    </BaseSidebarHeader>
  );
}
