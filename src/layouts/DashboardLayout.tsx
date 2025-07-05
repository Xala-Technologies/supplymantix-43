// Main dashboard layout with sidebar and header
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { DashboardHeader } from '@/components/Layout/DashboardHeader';
import { LicenseStatusBar } from '../components/licensing/LicenseStatusBar';
import { useLicense } from '../services/licensing/LicenseProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isTrialing, isExpired } = useLicense();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          {/* License status notification */}
          {(isTrialing || isExpired) && <LicenseStatusBar />}
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};