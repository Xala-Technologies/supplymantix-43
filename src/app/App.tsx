// Main application entry point following XALA standards
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AppProviders } from '@providers/AppProviders';
import { AppRouter } from './AppRouter';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { LocalizationProvider } from '@localization/LocalizationProvider';
import { LicenseProvider } from '@services/licensing/LicenseProvider';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof Error && error.message.includes('not authenticated')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LocalizationProvider>
            <LicenseProvider>
              <AppProviders>
                <AppRouter />
                <Toaster position="top-right" />
              </AppProviders>
            </LicenseProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};