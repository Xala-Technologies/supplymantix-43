
import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, initialized } = useAuthState();
  const { signIn, signUp, signOut } = useAuthActions();
  const queryClient = useQueryClient();
  const previousUserIdRef = useRef<string | null>(null);

  // Clear cache when user changes (including login/logout)
  useEffect(() => {
    if (initialized) {
      const currentUserId = user?.id || null;
      const previousUserId = previousUserIdRef.current;
      
      // If user has changed (login, logout, or user switch)
      if (currentUserId !== previousUserId) {
        console.log('User changed from', previousUserId, 'to', currentUserId, '- clearing cache');
        
        // Clear all queries to prevent data bleeding between users
        queryClient.clear();
        
        // Update the ref with the new user ID
        previousUserIdRef.current = currentUserId;
        
        // If we have a new user, invalidate all queries to force fresh data
        if (currentUserId) {
          console.log('New user logged in, invalidating all queries');
          setTimeout(() => {
            queryClient.invalidateQueries();
          }, 100);
        }
      }
    }
  }, [user?.id, initialized, queryClient]);

  const value: AuthContextType = useMemo(() => ({
    user,
    session,
    loading: loading || !initialized,
    signIn,
    signUp,
    signOut,
  }), [user, session, loading, initialized, signIn, signUp, signOut]);

  console.log('AuthProvider - User:', user?.email, 'Loading:', loading, 'Initialized:', initialized, 'Session:', !!session);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
