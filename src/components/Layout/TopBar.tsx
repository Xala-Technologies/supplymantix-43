
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Settings, User, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const TopBar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] md:peer-data-[state=collapsed]:left-[var(--sidebar-width-icon)] h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 z-30 transition-[left] duration-300 ease-linear">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side with modern sidebar toggle */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md" />
          
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search anything..."
              className="pl-10 w-80 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-lg">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-xs">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-lg">
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                ZB
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">Zach Brown</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
