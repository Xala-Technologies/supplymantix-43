
import type { Database } from "@/integrations/supabase/types";

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
  };

  console.log("Processed work order data:", workOrderData);
  return workOrderData;
};
