
import type { WorkOrderAsset, WorkOrderLocation } from '@/features/workOrders/types';

export const getAssetName = (asset: any): string => {
  if (!asset) return 'No Asset';
  if (typeof asset === 'string') return asset;
  if (typeof asset === 'object' && asset.name) return asset.name;
  return 'Unknown Asset';
};

export const getLocationName = (location: any): string => {
  if (!location) return 'No Location';
  if (typeof location === 'string') return location;
  if (typeof location === 'object' && location.name) return location.name;
  return 'Unknown Location';
};

export const getAssetInfo = (asset: any): WorkOrderAsset | null => {
  if (!asset) return null;
  if (typeof asset === 'string') return { id: '', name: asset };
  if (typeof asset === 'object' && asset.name) {
    return {
      id: asset.id || '',
      name: asset.name,
      status: asset.status,
      location: asset.location
    };
  }
  return null;
};

export const getLocationInfo = (location: any): WorkOrderLocation | null => {
  if (!location) return null;
  if (typeof location === 'string') return { id: '', name: location };
  if (typeof location === 'object' && location.name) {
    return {
      id: location.id || '',
      name: location.name
    };
  }
  return null;
};
