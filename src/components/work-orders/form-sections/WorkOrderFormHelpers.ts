
import { WorkOrder } from "@/types/workOrder";

export const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
  if (!assignedTo) return "";
  if (Array.isArray(assignedTo)) return assignedTo[0] || "";
  if (typeof assignedTo === "string") return assignedTo;
  if (typeof assignedTo === "object" && 'email' in assignedTo) {
    return assignedTo.email || "";
  }
  return "";
};

export const getLocationName = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location === "object" && 'name' in location) {
    return location.name || "";
  }
  return "";
};

export const getAssetName = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && 'name' in asset) {
    return asset.name || "";
  }
  return "";
};

export const getAssetId = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "object" && 'id' in asset) {
    return asset.id || "";
  }
  return "";
};

export const getLocationId = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "object" && 'id' in location) {
    return location.id || "";
  }
  return "";
};
