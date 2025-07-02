
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type Tables = Database["public"]["Tables"];

interface FormData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  assignedTo?: string;
  asset?: string;
  location?: string;
  category?: string;
  tags?: string;
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

  // Prepare work order data
  const workOrderData: Tables["work_orders"]["Insert"] = {
    title: formData.title,
    description: formData.description || "",
    priority: formData.priority,
    status: "open",
    category: formData.category || "maintenance",
    tags: tagsArray,
    due_date: formData.dueDate ? formData.dueDate.toISOString() : null,
    assigned_to: formData.assignedTo || null,
    asset_id: formData.asset || null,
    location_id: formData.location || null,
    tenant_id: userRecord.tenant_id,
  };

  console.log("Processed work order data:", workOrderData);
  return workOrderData;
};
