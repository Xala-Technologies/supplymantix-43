// Dashboard page - composition only
import React from 'react';
import { useDomainTranslation } from '../localization/LocalizationProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardPage: React.FC = () => {
  const { t } = useDomainTranslation('common');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('navigation.dashboard')}</h1>
        <p className="text-muted-foreground">
          Welcome to XALA Asset Management
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};