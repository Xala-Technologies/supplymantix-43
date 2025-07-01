
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Starting sign in process for:', email);
      
      // Clear all cached data before signing in to prevent data bleeding
      queryClient.clear();
      
      // Sign out any existing session first to prevent session conflicts
      await supabase.auth.signOut();
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful for user:', data.user?.email);
      
      // Verify the session is properly established
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session verification failed:', sessionError);
        return { error: sessionError || new Error('Session not established') };
      }
      
      // Clear cache again and invalidate to ensure fresh data for the new user
      queryClient.clear();
      
      // Force a delay to ensure auth state is fully updated
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 300);
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, company?: string) => {
    setLoading(true);
    try {
      console.log('Starting sign up process for:', email);
      
      // Clear any existing session to prevent conflicts
      await supabase.auth.signOut();
      queryClient.clear();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company: company,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      console.log('Sign up successful:', data.user?.email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('Starting sign out process...');
      
      // Get current session info for logging
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserEmail = session?.user?.email;
      
      // Clear all cached data before signing out
      queryClient.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful for user:', currentUserEmail);
      
      // Clear cache again after signout and reset all queries
      queryClient.clear();
      queryClient.resetQueries();
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Sign out exception:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
  };
};
