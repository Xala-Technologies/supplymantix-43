
import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Ref to track the current user ID to prevent unwanted switches
  const currentUserIdRef = useRef<string | null>(null);
  const isUnmountedRef = useRef(false);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    isUnmountedRef.current = false;
    
    console.log('Setting up auth state listener...');
    
    // Set initialization timeout as fallback
    initializationTimeoutRef.current = setTimeout(() => {
      if (mounted && !isUnmountedRef.current && !initialized) {
        console.log('Auth initialization timeout - forcing completion');
        setLoading(false);
        setInitialized(true);
      }
    }, 3000);
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          if (mounted && !isUnmountedRef.current) {
            const newUserId = session?.user?.id || null;
            currentUserIdRef.current = newUserId;
            setSession(session);
            setUser(session?.user ?? null);
            console.log('User set to:', session?.user?.email);
            setLoading(false);
            setInitialized(true);
            
            // Clear timeout since we completed successfully
            if (initializationTimeoutRef.current) {
              clearTimeout(initializationTimeoutRef.current);
              initializationTimeoutRef.current = null;
            }
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted && !isUnmountedRef.current) {
          setLoading(false);
          setInitialized(true);
          
          // Clear timeout
          if (initializationTimeoutRef.current) {
            clearTimeout(initializationTimeoutRef.current);
            initializationTimeoutRef.current = null;
          }
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        // Ignore auth changes if component is unmounted
        if (!mounted || isUnmountedRef.current) {
          console.log('Ignoring auth change - component unmounted');
          return;
        }

        const newUserId = session?.user?.id || null;
        
        // Only update if this is a legitimate user change
        if (newUserId !== currentUserIdRef.current) {
          console.log('Legitimate user change detected:', {
            from: currentUserIdRef.current,
            to: newUserId,
            event
          });
          
          currentUserIdRef.current = newUserId;
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User authenticated:', session.user.email);
          } else {
            console.log('User signed out');
          }
        }
        
        setLoading(false);
        setInitialized(true);
        
        // Clear timeout since auth state change completed
        if (initializationTimeoutRef.current) {
          clearTimeout(initializationTimeoutRef.current);
          initializationTimeoutRef.current = null;
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      isUnmountedRef.current = true;
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
      
      // Clear timeout on cleanup
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }
    };
  }, []);

  return { user, session, loading, initialized };
};
