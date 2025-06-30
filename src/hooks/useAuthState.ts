
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    console.log('Setting up auth state listener...');
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            setInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, initialized };
};
