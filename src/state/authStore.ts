// Zustand auth store with session management
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tenantId: string | null;
}

interface AuthActions {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // State
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      tenantId: null,

      // Actions
      setSession: (session) => set((state) => {
        state.session = session;
        state.user = session?.user || null;
        state.isAuthenticated = !!session?.user;
        state.isLoading = false;
      }),

      setUser: (user) => set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),

      setLoading: (loading) => set((state) => {
        state.isLoading = loading;
      }),

      signIn: async (email, password) => {
        set((state) => { state.isLoading = true; });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          set((state) => { state.isLoading = false; });
          return { error };
        }

        // Session will be set via the auth state change listener
        return { error: null };
      },

      signUp: async (email, password, metadata = {}) => {
        set((state) => { state.isLoading = true; });

        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: metadata
          }
        });

        if (error) {
          set((state) => { state.isLoading = false; });
          return { error };
        }

        set((state) => { state.isLoading = false; });
        return { error: null };
      },

      signOut: async () => {
        set((state) => { state.isLoading = true; });
        
        await supabase.auth.signOut();
        
        set((state) => {
          state.user = null;
          state.session = null;
          state.isAuthenticated = false;
          state.tenantId = null;
          state.isLoading = false;
        });
      },

      refreshSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        get().setSession(session);
      },

      initialize: () => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            get().setSession(session);

            // Fetch tenant information when user signs in
            if (session?.user && event === 'SIGNED_IN') {
              try {
                const { data: userData } = await supabase
                  .from('users')
                  .select('tenant_id')
                  .eq('id', session.user.id)
                  .single();

                if (userData?.tenant_id) {
                  set((state) => {
                    state.tenantId = userData.tenant_id;
                  });
                }
              } catch (error) {
                console.warn('Failed to fetch tenant ID:', error);
              }
            }

            // Clear tenant ID on sign out
            if (event === 'SIGNED_OUT') {
              set((state) => {
                state.tenantId = null;
              });
            }
          }
        );

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
          get().setSession(session);
        });

        // Return cleanup function
        return () => subscription.unsubscribe();
      }
    }))
  )
);