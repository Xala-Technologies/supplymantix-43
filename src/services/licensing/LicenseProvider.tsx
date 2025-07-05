// License provider with tenant-aware feature gating
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLicenseAware } from '@/hooks/useLicenseAware';
import type { TenantLicense, FeatureAccess } from '../../types/license';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface LicenseContextType {
  license: TenantLicense | null;
  checkFeatureAccess: (featureKey: string) => FeatureAccess;
  isLoading: boolean;
  isPlanActive: boolean;
  isTrialing: boolean;
  isExpired: boolean;
  refreshLicense: () => void;
}

const LicenseContext = createContext<LicenseContextType | null>(null);

interface LicenseProviderProps {
  children: React.ReactNode;
}

export const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const {
    license,
    isLoading,
    error,
    checkFeatureAccess,
    isPlanActive,
    isTrialing,
    isExpired
  } = useLicenseAware();

  const [hasShownExpiredNotice, setHasShownExpiredNotice] = useState(false);

  const refreshLicense = () => {
    // This would trigger a refetch in the useLicenseAware hook
    window.location.reload();
  };

  // Show license expired notice
  useEffect(() => {
    if (isExpired && !hasShownExpiredNotice) {
      setHasShownExpiredNotice(true);
    }
  }, [isExpired, hasShownExpiredNotice]);

  const value: LicenseContextType = {
    license,
    checkFeatureAccess,
    isLoading,
    isPlanActive,
    isTrialing,
    isExpired,
    refreshLicense
  };

  // Show loading state during initial license check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifiserer lisens..." />
      </div>
    );
  }

  // Show error state if license check failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lisensproblem</h2>
          <p className="text-muted-foreground mb-4">
            Kunne ikke verifisere lisens. Kontakt support hvis problemet vedvarer.
          </p>
          <Button onClick={refreshLicense}>
            Prøv igjen
          </Button>
        </Card>
      </div>
    );
  }

  // Show expired license notice
  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lisens utløpt</h2>
          <p className="text-muted-foreground mb-4">
            Din lisens har utløpt. Kontakt din administrator for å fornye tilgangen.
          </p>
          <Button onClick={() => window.location.href = '/upgrade'}>
            Oppgrader plan
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = (): LicenseContextType => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within LicenseProvider');
  }
  return context;
};