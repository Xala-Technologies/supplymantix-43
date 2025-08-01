import React from 'react';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { PurchaseOrdersListPanel } from './PurchaseOrdersListPanel';
import { PurchaseOrderDetailPanel } from './PurchaseOrderDetailPanel';

interface PurchaseOrdersSplitLayoutProps {
  purchaseOrders: PurchaseOrder[];
  selectedPurchaseOrder: string | null;
  onSelectPurchaseOrder: (id: string) => void;
  onEditPurchaseOrder: () => void;
  selectedPurchaseOrderData?: PurchaseOrder;
}

export const PurchaseOrdersSplitLayout: React.FC<PurchaseOrdersSplitLayoutProps> = ({
  purchaseOrders,
  selectedPurchaseOrder,
  onSelectPurchaseOrder,
  onEditPurchaseOrder,
  selectedPurchaseOrderData
}) => {
  return (
    <div className="flex h-full">
      {/* Left Panel - Purchase Orders List */}
      <div className="w-80 border-r border-border bg-background">
        <PurchaseOrdersListPanel
          purchaseOrders={purchaseOrders}
          selectedPurchaseOrder={selectedPurchaseOrder}
          onSelectPurchaseOrder={onSelectPurchaseOrder}
        />
      </div>
      
      {/* Right Panel - Purchase Order Details */}
      <div className="flex-1 bg-background">
        {selectedPurchaseOrderData ? (
          <PurchaseOrderDetailPanel
            purchaseOrder={selectedPurchaseOrderData}
            onEditPurchaseOrder={onEditPurchaseOrder}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a purchase order</h3>
              <p>Choose a purchase order from the list to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};