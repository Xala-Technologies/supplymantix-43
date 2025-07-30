import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'super_admin' | 'organization_admin' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async (): Promise<UserRole> => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .rpc('get_user_system_role', { user_id_param: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }

      return data || 'user';
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHasRole = (requiredRole: UserRole) => {
  const { data: userRole } = useUserRole();
  
  const roleHierarchy: Record<UserRole, number> = {
    'super_admin': 3,
    'organization_admin': 2,
    'user': 1,
  };

  return (userRole && roleHierarchy[userRole] >= roleHierarchy[requiredRole]) || false;
};

export const useIsAdmin = () => useHasRole('organization_admin');
export const useIsSuperAdmin = () => useHasRole('super_admin');