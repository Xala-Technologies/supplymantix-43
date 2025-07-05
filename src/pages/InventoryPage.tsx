// Inventory page - composition only
import React from 'react';
import { useDomainTranslation } from '../localization/LocalizationProvider';

export const InventoryPage: React.FC = () => {
  const { t } = useDomainTranslation('inventory');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          Manage inventory and stock levels
        </p>
      </div>
    </div>
  );
};