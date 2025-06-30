
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("tenant_id", userRecord.tenant_id);

      if (error) throw error;
      return data || [];
    },
  });
};
