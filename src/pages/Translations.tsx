
import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { StandardPageLayout, StandardPageHeader, StandardPageContent } from '@/components/Layout/StandardPageLayout';

const Translations = () => {
  return (
    <DashboardLayout>
      <StandardPageLayout>
        <StandardPageHeader 
          title="Translations"
          description="Manage language translations"
        />
        <StandardPageContent>
          <div className="text-center py-16">
            <p className="text-gray-600">Translation management coming soon...</p>
          </div>
        </StandardPageContent>
      </StandardPageLayout>
    </DashboardLayout>
  );
};

export default Translations;
