
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

  useEffect(() => {
    let mounted = true;
    isUnmountedRef.current = false;
    
    console.log('Setting up auth state listener...');
    
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          if (mounted && !isUnmountedRef.current) {
            // Only update if this is a legitimate session change
            const newUserId = session?.user?.id || null;
            if (newUserId !== currentUserIdRef.current) {
              currentUserIdRef.current = newUserId;
              setSession(session);
              setUser(session?.user ?? null);
              console.log('User set to:', session?.user?.email);
            }
            setLoading(false);
            setInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted && !isUnmountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener with better session validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        // Ignore auth changes if component is unmounted
        if (!mounted || isUnmountedRef.current) {
          console.log('Ignoring auth change - component unmounted');
          return;
        }

        // Validate session integrity
        if (session && session.user) {
          try {
            // Verify the session is still valid
            const { data: { user: currentUser }, error } = await supabase.auth.getUser();
            if (error || !currentUser || currentUser.id !== session.user.id) {
              console.warn('Session validation failed, clearing auth state');
              setSession(null);
              setUser(null);
              currentUserIdRef.current = null;
              setLoading(false);
              setInitialized(true);
              return;
            }
          } catch (validationError) {
            console.error('Session validation error:', validationError);
            setSession(null);
            setUser(null);
            currentUserIdRef.current = null;
            setLoading(false);
            setInitialized(true);
            return;
          }
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
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      isUnmountedRef.current = true;
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, initialized };
};
