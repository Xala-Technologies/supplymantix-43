
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  name: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category?: string;
  status?: string;
  criticality?: string;
}

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async (): Promise<Asset[]> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          console.log('No authenticated user, returning empty assets');
          return [];
        }

        const { data: userRecord } = await supabase
          .from("users")
          .select("tenant_id")
          .eq("id", userData.user.id)
          .single();

        if (!userRecord) {
          console.log('No user record found, returning empty assets');
          return [];
        }

        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('tenant_id', userRecord.tenant_id)
          .order('name');

        if (error) {
          console.error('Error fetching assets:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in useAssets:', error);
        return [];
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
