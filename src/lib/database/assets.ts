
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type AssetInsert = Tables["assets"]["Insert"];
type AssetUpdate = Tables["assets"]["Update"];
type Asset = Tables["assets"]["Row"];

export const assetsApi = {
  async getAssets(filters?: {
    search?: string;
    status?: string[];
    category?: string[];
    location?: string[];
    criticality?: string[];
  }) {
    // Get current user's tenant_id first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    let query = supabase
      .from("assets")
      .select("*")
      .eq("tenant_id", userData.tenant_id)
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,asset_tag.ilike.%${filters.search}%`);
    }
    
    if (filters?.status && filters.status.length > 0) {
      query = query.in("status", filters.status as ("active" | "maintenance" | "out_of_service" | "retired")[]);
    }
    
    if (filters?.category && filters.category.length > 0) {
      query = query.in("category", filters.category);
    }
    
    if (filters?.location && filters.location.length > 0) {
      query = query.in("location", filters.location);
    }
    
    if (filters?.criticality && filters.criticality.length > 0) {
      query = query.in("criticality", filters.criticality);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getAsset(id: string) {
    // Get current user's tenant_id first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", userData.tenant_id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createAsset(asset: AssetInsert) {
    console.log('Creating asset with data:', asset);
    
    const { data, error } = await supabase
      .from("assets")
      .insert(asset)
      .select()
      .single();
    
    if (error) {
      console.error('Database error creating asset:', error);
      throw error;
    }
    
    console.log('Asset created successfully:', data);
    return data;
  },

  async updateAsset(id: string, updates: AssetUpdate) {
    // Get current user's tenant_id for security
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { data, error } = await supabase
      .from("assets")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("tenant_id", userData.tenant_id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAsset(id: string) {
    // Get current user's tenant_id for security
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id)
      .eq("tenant_id", userData.tenant_id);
    
    if (error) throw error;
  },

  async getAssetsByLocation(location: string) {
    // Get current user's tenant_id first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("location", location)
      .eq("tenant_id", userData.tenant_id)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAssetsByCategory(category: string) {
    // Get current user's tenant_id first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("category", category)
      .eq("tenant_id", userData.tenant_id)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAssetStatistics() {
    // Get current user's tenant_id first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;
    if (!userData?.tenant_id) throw new Error('No tenant_id found');

    const { data, error } = await supabase
      .from("assets")
      .select("status, category, criticality")
      .eq("tenant_id", userData.tenant_id);
    
    if (error) throw error;
    
    // Calculate statistics
    const stats = {
      total: data.length,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byCriticality: {} as Record<string, number>
    };
    
    data.forEach(asset => {
      stats.byStatus[asset.status] = (stats.byStatus[asset.status] || 0) + 1;
      if (asset.category) {
        stats.byCategory[asset.category] = (stats.byCategory[asset.category] || 0) + 1;
      }
      if (asset.criticality) {
        stats.byCriticality[asset.criticality] = (stats.byCriticality[asset.criticality] || 0) + 1;
      }
    });
    
    return stats;
  }
};

export type { Asset, AssetInsert, AssetUpdate };
