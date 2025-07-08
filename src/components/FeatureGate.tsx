// License-aware feature gating component
import React from 'react';
import { useFeatureAccess } from '@/hooks/useLicenseAware';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowUp } from 'lucide-react';

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export const FeatureGate = ({ 
  featureKey, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) => {
  const access = useFeatureAccess(featureKey);

  if (access.can_access) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-text-tertiary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-text-primary">Feature Not Available</h3>
          <p className="text-sm text-text-secondary">
            {access.reason || 'This feature is not included in your current plan.'}
          </p>
        </div>

        {access.upgrade_required && (
          <Button className="w-full">
            <ArrowUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        )}

        {access.limit_reached && (
          <Alert>
            <AlertDescription>
              You've reached the usage limit for this feature. Consider upgrading your plan for higher limits.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export const LicenseAwareFeature = ({ 
  featureKey, 
  children, 
  ...props 
}: FeatureGateProps) => {
  return (
    <FeatureGate featureKey={featureKey} {...props}>
      {children}
    </FeatureGate>
  );
};