
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VendorContact {
  id: string;
  vendor_id: string;
  tenant_id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorContactInsert {
  vendor_id: string;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  is_primary?: boolean;
  tenant_id: string;
}

export const useVendorContacts = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor-contacts", vendorId],
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
        .from("vendor_contacts")
        .select("*")
        .eq("vendor_id", vendorId)
        .eq("tenant_id", userRecord.tenant_id)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!vendorId,
  });
};

export const useCreateVendorContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactData: Omit<VendorContactInsert, 'tenant_id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { data, error } = await supabase
        .from("vendor_contacts")
        .insert({ ...contactData, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-contacts", data.vendor_id] });
    }
  });
};

export const useDeleteVendorContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error("User record not found");

      const { error } = await supabase
        .from("vendor_contacts")
        .delete()
        .eq("id", id)
        .eq("tenant_id", userRecord.tenant_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-contacts"] });
    }
  });
};
