// License status notification bar
import React from 'react';
import { useLicense } from '@services/licensing/LicenseProvider';
import { useDomainTranslation } from '@localization/LocalizationProvider';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export const LicenseStatusBar: React.FC = () => {
  const { license, isTrialing, isExpired } = useLicense();
  const { t, formatDate } = useDomainTranslation('licensing');

  if (!license || (!isTrialing && !isExpired)) {
    return null;
  }

  const handleUpgrade = () => {
    window.location.href = '/upgrade';
  };

  if (isExpired) {
    return (
      <Alert variant="destructive" className="mx-6 mt-4 rounded-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{t('license_expired')}</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleUpgrade}
          >
            {t('renew_license')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isTrialing && license.trial_end) {
    const trialEndDate = new Date(license.trial_end);
    const daysLeft = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    return (
      <Alert className="mx-6 mt-4 rounded-lg border-warning bg-warning/10">
        <Clock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            {t('trial_expires_in', { days: daysLeft, date: formatDate(trialEndDate) })}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpgrade}
          >
            {t('upgrade_now')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};