
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  description?: string;
  location_code?: string;
  location_type?: string;
  address?: string;
  parent_id?: string;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          console.log('No authenticated user, returning empty locations');
          return [];
        }

        const { data: userRecord } = await supabase
          .from("users")
          .select("tenant_id")
          .eq("id", userData.user.id)
          .single();

        if (!userRecord) {
          console.log('No user record found, returning empty locations');
          return [];
        }

        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('tenant_id', userRecord.tenant_id)
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Error fetching locations:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in useLocations:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
