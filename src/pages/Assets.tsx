
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { AssetsHeader } from "@/components/assets/AssetsHeader";
import { AssetsList } from "@/components/assets/AssetsList";
import { AssetDetailCard } from "@/components/assets/AssetDetailCard";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>('asset-001');

  const sampleAssets = [
    {
      id: 'asset-001',
      name: 'Wrapper - Orion Model A',
      tag: 'WRP-001',
      status: 'Online',
      location: 'Production Line 3',
      category: 'Production Equipment',
      criticality: 'High',
      manufacturer: 'Orion Packaging',
      model: 'Model A-2023',
      serialNumber: 'ORN-2023-001',
      installDate: '2023-01-15',
      lastMaintenance: '2023-09-15',
      nextMaintenance: '2023-12-15',
      workOrders: 3,
      totalDowntime: '4.5 hours',
      specifications: {
        power: '15 kW',
        voltage: '400V',
        capacity: '200 packages/min',
        weight: '1,200 kg'
      },
      documentation: [
        { name: 'Installation Manual', type: 'PDF', size: '2.1 MB' },
        { name: 'Maintenance Guide', type: 'PDF', size: '1.8 MB' }
      ]
    },
    {
      id: 'asset-002',
      name: 'Conveyor - 3200 Series Modular',
      tag: 'CNV-002',
      status: 'Online',
      location: 'Production Line 2',
      category: 'Material Handling',
      criticality: 'Medium',
      manufacturer: 'FlexLink',
      model: '3200 Series',
      serialNumber: 'FL-3200-002',
      installDate: '2022-08-20',
      lastMaintenance: '2023-08-20',
      nextMaintenance: '2024-02-20',
      workOrders: 1,
      totalDowntime: '2.1 hours',
      specifications: {
        length: '50 meters',
        width: '200mm',
        speed: '0.1-15 m/min',
        loadCapacity: '50 kg/m'
      },
      documentation: [
        { name: 'Technical Specifications', type: 'PDF', size: '1.5 MB' }
      ]
    }
  ];

  const selectedAssetData = sampleAssets.find(asset => asset.id === selectedAsset) || sampleAssets[0];

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gray-50">
        <AssetsHeader />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden md:flex w-full">
            {/* Sidebar */}
            <AssetsList 
              assets={sampleAssets}
              selectedAssetId={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
            
            {/* Detail view */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-4 lg:p-6">
                <AssetDetailCard asset={selectedAssetData} />
              </div>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden w-full flex flex-col">
            {!selectedAsset ? (
              <AssetsList 
                assets={sampleAssets}
                selectedAssetId={selectedAsset}
                onSelectAsset={setSelectedAsset}
              />
            ) : (
              <>
                {/* Mobile header with back button */}
                <div className="p-3 border-b bg-white flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedAsset(null)}
                    className="p-1 h-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="font-medium text-gray-900 truncate">
                    {selectedAssetData.name}
                  </span>
                </div>
                
                {/* Mobile detail view */}
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                  <AssetDetailCard asset={selectedAssetData} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
