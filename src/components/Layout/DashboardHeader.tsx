// Dashboard header component
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold">XALA Asset Management</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};