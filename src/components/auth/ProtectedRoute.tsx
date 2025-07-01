
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // Additional security check - verify session matches user
  useEffect(() => {
    if (user && session && user.id !== session.user?.id) {
      console.warn('User/session mismatch detected, forcing re-auth');
      // This could indicate a session integrity issue
      window.location.href = '/login';
    }
  }, [user, session]);

  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email, 'Path:', location.pathname, 'Session valid:', !!session);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 text-lg">Verifying authentication...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or session is invalid
  if (!user || !session) {
    console.log('No valid user session found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content for:', user.email);
  return <>{children}</>;
};
