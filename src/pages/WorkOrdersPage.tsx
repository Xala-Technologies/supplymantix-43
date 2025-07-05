// Work Orders page - composition only
import React from 'react';
import { useDomainTranslation } from '../localization/LocalizationProvider';

export const WorkOrdersPage: React.FC = () => {
  const { t } = useDomainTranslation('work-orders');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          Manage work orders and maintenance tasks
        </p>
      </div>
    </div>
  );
};