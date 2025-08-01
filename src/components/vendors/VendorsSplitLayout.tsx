import React from 'react';
import { Vendor } from '@/hooks/useVendors';
import { VendorsListPanel } from './VendorsListPanel';
import { VendorDetailPanel } from './VendorDetailPanel';

interface VendorsSplitLayoutProps {
  vendors: Vendor[];
  selectedVendor: string | null;
  onSelectVendor: (id: string) => void;
  onEditVendor: () => void;
  selectedVendorData?: Vendor;
}

export const VendorsSplitLayout: React.FC<VendorsSplitLayoutProps> = ({
  vendors,
  selectedVendor,
  onSelectVendor,
  onEditVendor,
  selectedVendorData
}) => {
  return (
    <div className="flex h-full">
      {/* Left Panel - Vendors List */}
      <div className="w-80 border-r border-border bg-background">
        <VendorsListPanel
          vendors={vendors}
          selectedVendor={selectedVendor}
          onSelectVendor={onSelectVendor}
        />
      </div>
      
      {/* Right Panel - Vendor Details */}
      <div className="flex-1 bg-background">
        {selectedVendorData ? (
          <VendorDetailPanel
            vendor={selectedVendorData}
            onEditVendor={onEditVendor}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a vendor</h3>
              <p>Choose a vendor from the list to view their details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};