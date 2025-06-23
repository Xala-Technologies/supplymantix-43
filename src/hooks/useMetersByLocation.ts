
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMetersByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ["meters-by-location", locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meters")
        .select("*")
        .eq("location", locationId) // Note: using location field as string for now
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!locationId,
  });
};
