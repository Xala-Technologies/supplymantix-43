
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

export const getAssetId = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "object" && asset !== null && 'id' in asset) {
    const assetObj = asset as { id?: string };
    return assetObj.id || "";
  }
  return "";
};

export const getLocationId = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "object" && location !== null && 'id' in location) {
    const locationObj = location as { id?: string };
    return locationObj.id || "";
  }
  return "";
};
