
import { supabase } from "@/integrations/supabase/client";

export const getCurrentTenantId = async (): Promise<string> => {
  console.log('getCurrentTenantId: Getting current user and tenant...');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('getCurrentTenantId: Auth error:', authError);
    throw new Error('Authentication error: ' + authError.message);
  }
  
  if (!user) {
    console.error('getCurrentTenantId: No authenticated user found');
    throw new Error('No authenticated user found');
  }
  
  console.log('getCurrentTenantId: User found:', user.id);
  
  // Get tenant_id from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single();
  
  if (userError) {
    console.error('getCurrentTenantId: Error fetching user data:', userError);
    throw new Error('Error fetching user data: ' + userError.message);
  }
  
  if (!userData?.tenant_id) {
    console.error('getCurrentTenantId: No tenant_id found for user');
    throw new Error('No tenant found for user');
  }
  
  console.log('getCurrentTenantId: Tenant ID found:', userData.tenant_id);
  return userData.tenant_id;
};
