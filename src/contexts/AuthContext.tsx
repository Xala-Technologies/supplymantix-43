
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
  
  // All refs must be declared at the top level to maintain hook order
  const previousUserIdRef = useRef<string | null>(null);
  const isProcessingUserChangeRef = useRef(false);

  // Enhanced cache clearing when user changes with duplicate prevention
  useEffect(() => {
    if (initialized && !isProcessingUserChangeRef.current) {
      const currentUserId = user?.id || null;
      const previousUserId = previousUserIdRef.current;
      
      // Check if this is a legitimate user change
      if (currentUserId !== previousUserId) {
        isProcessingUserChangeRef.current = true;
        
        console.log('User change detected:', {
          from: previousUserId,
          to: currentUserId,
          userEmail: user?.email
        });
        
        // Clear all queries to prevent data bleeding between users
        queryClient.clear();
        queryClient.resetQueries();
        
        // Update the ref with the new user ID
        previousUserIdRef.current = currentUserId;
        
        // If we have a new user, invalidate all queries to force fresh data
        if (currentUserId) {
          console.log('New user session established, invalidating queries for:', user?.email);
          setTimeout(() => {
            queryClient.invalidateQueries();
            isProcessingUserChangeRef.current = false;
          }, 200);
        } else {
          console.log('User signed out, queries cleared');
          isProcessingUserChangeRef.current = false;
        }
      }
    }
  }, [user?.id, initialized, queryClient, user?.email]);

  const value: AuthContextType = useMemo(() => ({
    user,
    session,
    loading: loading && !initialized, // Only show loading if not initialized
    signIn,
    signUp,
    signOut,
  }), [user, session, loading, initialized, signIn, signUp, signOut]);

  console.log('AuthProvider - User:', user?.email || 'undefined', 'Loading:', loading && !initialized, 'Initialized:', initialized, 'Session exists:', !!session);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
