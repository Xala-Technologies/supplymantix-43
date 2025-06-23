
import { supabase } from "@/integrations/supabase/client";

// Get current user's tenant ID from the users table
export const getCurrentTenantId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data: userData, error } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();
    
  if (error) throw error;
  return userData.tenant_id;
};
