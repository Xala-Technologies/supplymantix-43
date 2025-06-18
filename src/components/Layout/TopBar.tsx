
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOut, User, Bell, Search, Menu, X } from "lucide-react";

export const TopBar = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { state, toggleSidebar } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    const firstName = user?.user_metadata?.first_name;
    const lastName = user?.user_metadata?.last_name;
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  const getUserDisplayName = () => {
    const firstName = user?.user_metadata?.first_name;
    const lastName = user?.user_metadata?.last_name;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) {
      return firstName;
    }
    
    return user?.email || 'User';
  };

  const isCollapsed = state === "collapsed";

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm transition-all duration-300">
      <div className="flex h-full items-center">
        {/* Enhanced Sidebar Toggle */}
        <div 
          className={`
            flex items-center gap-4 transition-all duration-300 ease-in-out
            ${isCollapsed 
              ? 'ml-4' 
              : 'ml-[296px]'
            }
          `}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className={`
              relative h-10 w-10 p-0 rounded-xl transition-all duration-300 ease-in-out
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 
              hover:border-blue-200/50 hover:shadow-md
              ${isCollapsed 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 shadow-sm' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu 
                className={`
                  absolute transition-all duration-300 ease-in-out
                  ${isCollapsed 
                    ? 'opacity-0 rotate-90 scale-75' 
                    : 'opacity-100 rotate-0 scale-100'
                  }
                `} 
                size={18} 
              />
              <X 
                className={`
                  absolute transition-all duration-300 ease-in-out
                  ${isCollapsed 
                    ? 'opacity-100 rotate-0 scale-100' 
                    : 'opacity-0 rotate-90 scale-75'
                  }
                `} 
                size={18} 
              />
            </div>
          </Button>
        </div>

        {/* Enhanced Center Section with Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200 group-focus-within:text-blue-500" />
              <Input 
                type="search" 
                placeholder={t('common.search')} 
                className="
                  pl-11 pr-4 h-11 
                  bg-gray-50/80 border-0 rounded-xl
                  focus-visible:ring-2 focus-visible:ring-blue-500/20 
                  focus-visible:bg-white focus-visible:shadow-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-gray-100/80 hover:shadow-sm
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>
        </div>

        {/* Enhanced Right Section */}
        <div className="flex items-center space-x-3 pr-6">
          {/* Enhanced Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Enhanced Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="
              relative h-10 w-10 p-0 rounded-xl transition-all duration-200
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 
              hover:border-blue-200/50 hover:shadow-md
              group
            "
          >
            <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
              3
            </div>
          </Button>

          {/* Enhanced User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="
                  flex items-center space-x-3 h-auto px-3 py-2 rounded-xl
                  hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 
                  hover:border-blue-200/50 hover:shadow-md
                  transition-all duration-200 group
                "
              >
                <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm group-hover:ring-blue-200 transition-all duration-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 text-white text-sm font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-md"
            >
              <DropdownMenuItem className="rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
