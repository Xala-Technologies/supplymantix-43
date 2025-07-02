
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface Asset {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface WorkOrderFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  assignedTo: string;
  asset: string;
  location: string;
  category: string;
  tags: string;
}

export const processWorkOrderSubmission = async (
  data: WorkOrderFormData,
  users?: User[],
  assets?: Asset[],
  locations?: Location[]
) => {
  console.log("processWorkOrderSubmission - Input data:", data);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("Please log in to manage work orders");
    throw new Error("User not authenticated");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (userError || !userData) {
    toast.error("Error getting user information");
    throw new Error("User data not found");
  }

  // For asset and location, the data.asset and data.location should already be IDs
  let selectedAssetId = null;
  let selectedLocationId = null;

  if (data.asset) {
    console.log("Processing asset:", data.asset);
    // Check if it's already an ID (UUID format)
    if (data.asset.length === 36 && data.asset.includes('-')) {
      selectedAssetId = data.asset;
      console.log("Asset is already an ID:", selectedAssetId);
    } else {
      // Try to find by name
      const selectedAsset = assets?.find(asset => asset.name === data.asset);
      if (selectedAsset) {
        selectedAssetId = selectedAsset.id;
        console.log("Found asset by name:", selectedAsset);
      }
    }
  }

  if (data.location) {
    console.log("Processing location:", data.location);
    // Check if it's already an ID (UUID format)
    if (data.location.length === 36 && data.location.includes('-')) {
      selectedLocationId = data.location;
      console.log("Location is already an ID:", selectedLocationId);
    } else {
      // Try to find by name
      const selectedLocation = locations?.find(location => location.name === data.location);
      if (selectedLocation) {
        selectedLocationId = selectedLocation.id;
        console.log("Found location by name:", selectedLocation);
      }
    }
  }

  // Find actual user ID for assignee
  const selectedUser = users?.find(user => 
    user.email === data.assignedTo || 
    `${user.first_name} ${user.last_name}`.trim() === data.assignedTo ||
    user.id === data.assignedTo
  );
  
  // Convert tags string to array
  const tagsArray = data.tags 
    ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];
  
  const result = {
    title: data.title,
    description: data.description || "",
    due_date: data.dueDate?.toISOString(),
    assigned_to: selectedUser?.id || null,
    asset_id: selectedAssetId,
    location_id: selectedLocationId,
    tenant_id: userData.tenant_id,
    status: "open" as const,
    priority: data.priority,
    category: data.category,
    tags: tagsArray,
    requester_id: user.id,
  };
  
  console.log("processWorkOrderSubmission - Final result:", result);
  return result;
};
