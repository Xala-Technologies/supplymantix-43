
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = () => {
  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in result:', { user: data.user?.email, error });
      
      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, company?: string) => {
    console.log('Attempting to sign up:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: firstName,
            last_name: lastName,
            company: company,
          },
        },
      });

      console.log('Sign up result:', { user: data.user?.email, error });
      
      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      } else {
        console.log('Successfully signed out');
      }
    } catch (error) {
      console.error('Sign out exception:', error);
      throw error;
    }
  };

  return { signIn, signUp, signOut };
};
