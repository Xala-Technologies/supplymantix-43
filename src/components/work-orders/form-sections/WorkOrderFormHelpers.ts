

import { WorkOrder } from "@/types/workOrder";

export const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
  if (!assignedTo) return "";
  if (Array.isArray(assignedTo)) return assignedTo[0] || "";
  if (typeof assignedTo === "string") return assignedTo;
  // Handle object type with email property
  if (typeof assignedTo === "object" && assignedTo !== null && 'email' in assignedTo) {
    const assignedToObj = assignedTo as { email?: string };
    return assignedToObj.email || "";
  }
  return "";
};

export const getLocationName = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location === "object" && location !== null && 'name' in location) {
    const locationObj = location as { name?: string };
    return locationObj.name || "";
  }
  return "";
};

export const getAssetName = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset !== null && 'name' in asset) {
    const assetObj = asset as { name?: string };
    return assetObj.name || "";
  }
  return "";
};

export const getAssetId = (asset: WorkOrder['asset'], fallbackAssetId?: string, workOrderData?: any): string => {
  // First try to get ID from workOrderData.assets (from database join)
  if (workOrderData?.assets?.id) {
    return workOrderData.assets.id;
  }
  
  // Try to get ID from asset object
  if (asset && typeof asset === "object" && asset !== null && 'id' in asset) {
    const assetObj = asset as { id?: string };
    return assetObj.id || "";
  }
  
  // If asset is a string, it might be the ID itself
  if (typeof asset === "string") return asset;
  
  // Use fallback asset_id if available
  return fallbackAssetId || "";
};

export const getLocationId = (location: WorkOrder['location'], fallbackLocationId?: string, workOrderData?: any): string => {
  // First try to get ID from workOrderData.location (from database join)
  if (workOrderData?.location?.id) {
    return workOrderData.location.id;
  }
  
  // Try to get ID from location object
  if (location && typeof location === "object" && location !== null && 'id' in location) {
    const locationObj = location as { id?: string };
    return locationObj.id || "";
  }
  
  // If location is a string, it might be the ID itself
  if (typeof location === "string") return location;
  
  // Use fallback location_id if available
  return fallbackLocationId || "";
};

