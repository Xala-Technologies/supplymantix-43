
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AuthDebugLog = () => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Current session:', session);
        console.log('Session error:', error);
        
        if (session?.user) {
          // Check if user exists in users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log('User data from users table:', userData);
          console.log('User query error:', userError);
          
          // Check tenant_id
          if (userData?.tenant_id) {
            console.log('User tenant_id:', userData.tenant_id);
          } else {
            console.log('WARNING: No tenant_id found for user');
          }
        }
      } catch (error) {
        console.error('Auth debug error:', error);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
};
