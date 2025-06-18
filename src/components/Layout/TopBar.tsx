
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOut, User, Bell, Search } from "lucide-react";

export const TopBar = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { state } = useSidebar();

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

  const sidebarWidth = state === "expanded" ? "280px" : "64px";

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left section with sidebar trigger */}
        <div 
          className="flex items-center gap-4 min-w-0 transition-all duration-300 ease-in-out"
          style={{ 
            marginLeft: `calc(${sidebarWidth} + 1rem)`,
          }}
        >
          <div className="relative">
            <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors duration-200" />
          </div>
        </div>

        {/* Center section with search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200 group-focus-within:text-primary" />
            <Input 
              type="search" 
              placeholder={t('common.search')} 
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background/80 w-full h-9 transition-all duration-200 hover:bg-muted/70"
            />
          </div>
        </div>

        {/* Right section with actions */}
        <div className="flex items-center space-x-2 min-w-0">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 shrink-0 hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </Button>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 h-auto px-3 py-2 min-w-0 hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                <User className="mr-2 h-4 w-4" />
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200">
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
