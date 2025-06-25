
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkOrdersIntegration } from '@/features/workOrders/hooks/useWorkOrdersIntegration';
import { useRequests } from '@/hooks/useRequests';
import { useAssets } from '@/hooks/useAssets';
import { useInventoryItems } from '@/hooks/useInventory';

export const DataDebugComponent = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: workOrders, isLoading: workOrdersLoading, error: workOrdersError } = useWorkOrdersIntegration();
  const { data: requests, isLoading: requestsLoading } = useRequests();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: inventory, isLoading: inventoryLoading } = useInventoryItems();

  console.log('Debug Info:', {
    user: user?.email,
    authLoading,
    workOrders: workOrders?.length || 0,
    workOrdersRaw: workOrders,
    workOrdersLoading,
    workOrdersError,
    requests: requests?.length || 0,
    requestsLoading,
    assets: assets?.length || 0,
    assetsLoading,
    inventory: inventory?.length || 0,
    inventoryLoading,
  });

  return (
    <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-bold text-sm mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>User: {user?.email || 'Not logged in'}</div>
        <div>Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
        <div>Work Orders: {workOrdersLoading ? 'Loading...' : `${workOrders?.length || 0} items`}</div>
        <div>WO Raw Data: {workOrders ? JSON.stringify(workOrders.slice(0, 1)) : 'null'}</div>
        <div>Requests: {requestsLoading ? 'Loading...' : `${requests?.length || 0} items`}</div>
        <div>Assets: {assetsLoading ? 'Loading...' : `${assets?.length || 0} items`}</div>
        <div>Inventory: {inventoryLoading ? 'Loading...' : `${inventory?.length || 0} items`}</div>
        {workOrdersError && <div className="text-red-500">WO Error: {workOrdersError.message}</div>}
      </div>
    </div>
  );
};
