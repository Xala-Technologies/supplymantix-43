
import { SidebarFooter as BaseSidebarFooter } from "@/components/ui/sidebar";

export function AppSidebarFooter() {
  return (
    <BaseSidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-surface-secondary border border-border-secondary">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success to-success-600 flex items-center justify-center shadow-sm">
          <div className="w-2 h-2 rounded-full bg-white opacity-90"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-primary tracking-wide">System Status</div>
          <div className="text-sm text-success-600 font-medium">All systems operational</div>
        </div>
      </div>
    </BaseSidebarFooter>
  );
}
