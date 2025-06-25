
import { WorkOrder } from "@/types/workOrder";

// Helper function to safely extract assignee
export const getAssignee = (assignedTo: WorkOrder['assignedTo']): string => {
  if (!assignedTo) return "";
  if (Array.isArray(assignedTo)) return assignedTo[0] || "";
  if (typeof assignedTo === "string") return assignedTo;
  return "";
};

// Helper function to safely extract location name
export const getLocationName = (location: WorkOrder['location']): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location === "object" && location.name) return location.name;
  return "";
};

// Helper function to safely extract asset name
export const getAssetName = (asset: WorkOrder['asset']): string => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && asset.name) return asset.name;
  return "";
};
