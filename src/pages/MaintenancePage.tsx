// Maintenance page - composition only
import React from 'react';
import { useDomainTranslation } from '../localization/LocalizationProvider';

export const MaintenancePage: React.FC = () => {
  const { t } = useDomainTranslation('common');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('navigation.maintenance')}</h1>
        <p className="text-muted-foreground">
          Preventive maintenance and scheduling
        </p>
      </div>
    </div>
  );
};