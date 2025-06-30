
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Part {
  id: string;
  tenant_id: string;
  name: string;
  part_number?: string;
  description?: string;
  unit_cost?: number;
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

export const useParts = () => {
  return useQuery({
    queryKey: ["parts"],
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
        .from("parts")
        .select("*")
        .eq("tenant_id", userRecord.tenant_id);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partData: Omit<Part, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("parts")
        .insert({ ...partData, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    }
  });
};
