
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Asset {
  id: string;
  name: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category: string;
  criticality: string;
  status: "active" | "maintenance" | "out_of_service" | "retired";
  tenant_id: string;
  created_at: string;
  updated_at: string;
  // New fields
  picture_url?: string;
  purchase_date?: string;
  purchase_price?: number;
  annual_depreciation_value?: number;
  warranty_end_date?: string;
  vin_number?: string;
  replacement_date?: string;
  serial_number?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  teams_in_charge?: string[];
  qr_code?: string;
  barcode?: string;
  asset_type?: string;
  vendor?: string;
  parts?: any[];
  parent_asset_id?: string;
}

export interface AssetInsert {
  name: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category: string;
  criticality: string;
  status: "active" | "maintenance" | "out_of_service" | "retired";
  tenant_id: string;
  // New fields
  picture_url?: string;
  purchase_date?: string;
  purchase_price?: number;
  annual_depreciation_value?: number;
  warranty_end_date?: string;
  vin_number?: string;
  replacement_date?: string;
  serial_number?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  teams_in_charge?: string[];
  qr_code?: string;
  barcode?: string;
  asset_type?: string;
  vendor?: string;
  parts?: any[];
  parent_asset_id?: string;
}

export interface AssetUpdate {
  name?: string;
  description?: string;
  location?: string;
  asset_tag?: string;
  category?: string;
  criticality?: string;
  status?: "active" | "maintenance" | "out_of_service" | "retired";
  tenant_id: string;
  // New fields
  picture_url?: string;
  purchase_date?: string;
  purchase_price?: number;
  annual_depreciation_value?: number;
  warranty_end_date?: string;
  vin_number?: string;
  replacement_date?: string;
  serial_number?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  teams_in_charge?: string[];
  qr_code?: string;
  barcode?: string;
  asset_type?: string;
  vendor?: string;
  parts?: any[];
  parent_asset_id?: string;
}

export const useAssets = (filters?: any) => {
  return useQuery({
    queryKey: ["assets", filters],
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
      
      // Transform the data to ensure parts is always an array
      const transformedData = (data || []).map(asset => ({
        ...asset,
        parts: Array.isArray(asset.parts) ? asset.parts : (asset.parts ? [asset.parts] : [])
      }));
      
      return transformedData;
    },
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assetData: Omit<AssetInsert, 'tenant_id'>) => {
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
        .insert({ ...assetData, tenant_id: userRecord.tenant_id })
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to ensure parts is always an array
      const transformedData = {
        ...data,
        parts: Array.isArray(data.parts) ? data.parts : (data.parts ? [data.parts] : [])
      };
      
      return transformedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    }
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Omit<AssetUpdate, 'tenant_id'> }) => {
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
        .update(updates)
        .eq("id", id)
        .eq("tenant_id", userRecord.tenant_id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to ensure parts is always an array
      const transformedData = {
        ...data,
        parts: Array.isArray(data.parts) ? data.parts : (data.parts ? [data.parts] : [])
      };
      
      return transformedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    }
  });
};

export const useDeleteAsset = () => {
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
        .from("assets")
        .delete()
        .eq("id", id)
        .eq("tenant_id", userRecord.tenant_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    }
  });
};
