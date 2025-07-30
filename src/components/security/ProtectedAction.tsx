import React from 'react';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface ProtectedActionProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
  onUnauthorized?: () => void;
}

export const ProtectedAction = ({ 
  requiredRole, 
  children, 
  fallback,
  showError = false,
  onUnauthorized 
}: ProtectedActionProps) => {
  const { data: userRole, isLoading, error } = useUserRole();

  const roleHierarchy: Record<UserRole, number> = {
    'super_admin': 3,
    'organization_admin': 2,
    'user': 1,
  };

  if (isLoading) {
    return fallback || null;
  }

  if (error) {
    console.error('Error checking user role:', error);
    if (onUnauthorized) onUnauthorized();
    return showError ? (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Unable to verify permissions. Please try again.
        </AlertDescription>
      </Alert>
    ) : (fallback || null);
  }

  const hasPermission = userRole && roleHierarchy[userRole] >= roleHierarchy[requiredRole];

  if (!hasPermission) {
    if (onUnauthorized) onUnauthorized();
    return showError ? (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Required role: {requiredRole}
        </AlertDescription>
      </Alert>
    ) : (fallback || null);
  }

  return <>{children}</>;
};