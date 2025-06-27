
import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataLoadingManagerProps {
  isLoading: boolean;
  isRetrying?: boolean;
  error?: Error | null;
  retryCount?: number;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  showRetryButton?: boolean;
}

export const DataLoadingManager: React.FC<DataLoadingManagerProps> = ({
  isLoading,
  isRetrying = false,
  error,
  retryCount = 0,
  onRetry,
  children,
  loadingText = "Loading data...",
  errorText,
  showRetryButton = true
}) => {
  if (isLoading && !isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 text-sm">{loadingText}</p>
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-orange-600" />
          <span className="text-orange-600 font-medium">
            Retrying... (Attempt {retryCount + 1})
          </span>
        </div>
        <p className="text-gray-600 text-sm">Connection issues detected, trying again...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-3">
              <p className="font-medium">
                {errorText || "Failed to load data"}
              </p>
              <p className="text-sm">
                {error.message}
              </p>
              {showRetryButton && onRetry && (
                <Button 
                  onClick={onRetry}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
