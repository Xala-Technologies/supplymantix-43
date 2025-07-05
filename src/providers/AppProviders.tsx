// Centralized providers wrapper
import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@features/auth/providers/AuthProvider';
import { useAuthStore } from '@state/authStore';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    // Initialize auth state management
    const cleanup = initializeAuth();
    return cleanup;
  }, [initializeAuth]);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};