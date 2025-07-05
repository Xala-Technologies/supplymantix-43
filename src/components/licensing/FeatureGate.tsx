// Enhanced feature gate with licensing enforcement
import React from 'react';
import { useLicense } from '../../services/licensing/LicenseProvider';
import { useDomainTranslation } from '../../localization/LocalizationProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowUp, AlertTriangle } from 'lucide-react';

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  planRequired?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  featureKey, 
  children, 
  fallback,
  showUpgradePrompt = true,
  planRequired
}) => {
  const { checkFeatureAccess } = useLicense();
  const { t } = useDomainTranslation('licensing');
  
  const access = checkFeatureAccess(featureKey);

  // Grant access if feature is available
  if (access.can_access) {
    return <>{children}</>;
  }

  // Use custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Don't show anything if upgrade prompt is disabled
  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">
            {t('feature_not_available')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {access.reason || t('feature_not_in_plan')}
          </p>
          {planRequired && (
            <p className="text-sm font-medium text-primary">
              {t('required_plan', { plan: planRequired })}
            </p>
          )}
        </div>

        {access.upgrade_required && (
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/upgrade'}
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            {t('upgrade_plan')}
          </Button>
        )}

        {access.limit_reached && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('usage_limit_reached')}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

// Convenient wrapper component
export const LicenseAwareFeature: React.FC<FeatureGateProps> = (props) => {
  return <FeatureGate {...props} />;
};