
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Asset {
  id: string;
  name: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category?: string;
  status?: string;
  criticality?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface AssetInsert {
  name: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category?: string;
  status?: string;
  criticality?: string;
}

export interface AssetUpdate {
  name?: string;
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

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: AssetInsert) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const { data: userRecord } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user.id)
        .single();

      if (!userRecord) throw new Error('No user record found');

      const { data, error } = await supabase
        .from('assets')
        .insert({ ...asset, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset created successfully');
    },
    onError: (error) => {
      console.error('Failed to create asset:', error);
      toast.error('Failed to create asset');
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AssetUpdate }) => {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update asset:', error);
      toast.error('Failed to update asset');
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete asset:', error);
      toast.error('Failed to delete asset');
    },
  });
};
