
import { supabase } from "@/integrations/supabase/client";

export const getCurrentTenantId = async (): Promise<string | null> => {
  console.log('Getting current tenant ID...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('No authenticated user found');
    return null;
  }
  
  const { data, error } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();
  
  if (error) {
    console.error('Error fetching tenant ID:', error);
    return null;
  }
  
  console.log('Current tenant ID:', data?.tenant_id);
  return data?.tenant_id || null;
};
