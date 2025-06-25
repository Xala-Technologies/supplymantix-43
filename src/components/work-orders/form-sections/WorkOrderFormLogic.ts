
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
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  assignedTo?: string;
  asset?: string;
  location?: string;
  category: string;
  tags?: string;
}

export const processWorkOrderSubmission = async (
  data: WorkOrderFormData,
  users?: User[],
  assets?: Asset[],
  locations?: Location[]
) => {
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

  // Find actual IDs for location and asset
  const selectedLocation = locations?.find(loc => 
    loc.name === data.location || loc.id === data.location
  );
  
  const selectedAsset = assets?.find(asset => 
    asset.name === data.asset || asset.id === data.asset
  );

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
  
  return {
    title: data.title,
    description: data.description || "",
    due_date: data.dueDate?.toISOString(),
    assigned_to: selectedUser?.id || null,
    asset_id: selectedAsset?.id || null,
    location_id: selectedLocation?.id || null,
    tenant_id: userData.tenant_id,
    status: "open" as const,
    priority: data.priority,
    category: data.category,
    tags: tagsArray,
    requester_id: user.id,
  };
};
