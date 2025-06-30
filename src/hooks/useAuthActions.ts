
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Clear all cached data before signing in
      queryClient.clear();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful:', data.user?.email);
      
      // Clear cache again after successful login to ensure fresh data
      queryClient.clear();
      
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
      console.log('Signing out...');
      
      // Clear all cached data before signing out
      queryClient.clear();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      
      // Clear cache again after signout
      queryClient.clear();
      
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
