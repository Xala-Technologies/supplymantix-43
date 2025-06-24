
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  description?: string;
  location_code?: string;
  location_type: string;
  address?: string;
  is_active: boolean;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<Location[]> => {
      console.log('Fetching locations...');
      
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });
      
      if (error) {
        console.error('Locations query error:', error);
        throw error;
      }
      
      console.log('Locations data:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
