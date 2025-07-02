
import { WorkOrder } from "@/types/workOrder";

export const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
  if (!assignedTo) return "";
  if (Array.isArray(assignedTo)) return assignedTo[0] || "";
  if (typeof assignedTo === "string") return assignedTo;
  // Handle object type with email property
  if (typeof assignedTo === "object" && assignedTo && 'email' in assignedTo && typeof assignedTo.email === 'string') {
    return assignedTo.email;
  }
  return "";
};

export const getLocationName = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location === "object" && location && 'name' in location && typeof location.name === 'string') {
    return location.name;
  }
  return "";
};

export const getAssetName = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset && 'name' in asset && typeof asset.name === 'string') {
    return asset.name;
  }
  return "";
};

export const getAssetId = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "object" && asset && 'id' in asset && typeof asset.id === 'string') {
    return asset.id;
  }
  return "";
};

export const getLocationId = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "object" && location && 'id' in location && typeof location.id === 'string') {
    return location.id;
  }
  return "";
};
