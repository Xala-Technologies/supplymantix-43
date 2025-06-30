
import React, { createContext, useContext, useMemo } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

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
