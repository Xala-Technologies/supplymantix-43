
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type Tables = Database["public"]["Tables"];

interface FormData {
  title: string;
  description?: string;
  priority: "none" | "low" | "medium" | "high";
  dueDate?: Date;
  startDate?: Date;
  assignedTo?: string;
  asset?: string;
  location?: string;
  category?: string;
  tags?: string;
  estimatedHours?: string;
  estimatedMinutes?: string;
  recurrence?: string;
  workType?: string;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface Asset {
  id: string;
  name: string;
  location?: string;
}

interface Location {
  id: string;
  name: string;
}

export const processWorkOrderSubmission = async (
  formData: FormData,
  users?: User[],
  assets?: Asset[],
  locations?: Location[]
): Promise<Tables["work_orders"]["Insert"]> => {
  console.log("Processing form data:", formData);

  // Get current user's tenant_id
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("User not authenticated");
  }

  const { data: userRecord, error: userRecordError } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", userData.user.id)
    .single();

  if (userRecordError || !userRecord) {
    throw new Error("Failed to get user tenant information");
  }

  // Convert tags string to array
  const tagsArray = formData.tags ? 
    formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
    [];

  // Process form values - convert "none" and "unassigned" to null
  const processedAssignedTo = formData.assignedTo === "unassigned" ? null : formData.assignedTo;
  const processedAsset = formData.asset === "none" ? null : formData.asset;
  const processedLocation = formData.location === "none" ? null : formData.location;

  // Convert priority "none" to "low" for database compatibility
  const dbPriority = formData.priority === "none" ? "low" : formData.priority as "low" | "medium" | "high";

  // Prepare work order data
  const workOrderData: Tables["work_orders"]["Insert"] = {
    title: formData.title,
    description: formData.description || "",
    priority: dbPriority,
    status: "open",
    category: formData.category || "maintenance",
    tags: tagsArray,
    due_date: formData.dueDate ? formData.dueDate.toISOString() : null,
    start_date: formData.startDate ? formData.startDate.toISOString() : null,
    assigned_to: processedAssignedTo || null,
    asset_id: processedAsset || null,
    location_id: processedLocation || null,
    tenant_id: userRecord.tenant_id,
  };

  console.log("Processed work order data:", workOrderData);
  return workOrderData;
};
