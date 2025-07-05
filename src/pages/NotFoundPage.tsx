// 404 page - composition only
import React from 'react';
import { Link } from 'react-router-dom';
import { useDomainTranslation } from '../localization/LocalizationProvider';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  const { t } = useDomainTranslation('common');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">
            {t('actions.back')} to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};