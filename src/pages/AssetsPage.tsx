// Assets page - composition only
import React from 'react';
import { useDomainTranslation } from '../localization/LocalizationProvider';

export const AssetsPage: React.FC = () => {
  const { t } = useDomainTranslation('assets');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          Manage your assets and equipment
        </p>
      </div>
    </div>
  );
};