
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
    let query = supabase
      .from("assets")
      .select("*")
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
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createAsset(asset: AssetInsert) {
    const { data, error } = await supabase
      .from("assets")
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAsset(id: string, updates: AssetUpdate) {
    const { data, error } = await supabase
      .from("assets")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAsset(id: string) {
    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async getAssetsByLocation(location: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("location", location)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAssetsByCategory(category: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("category", category)
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAssetStatistics() {
    const { data, error } = await supabase
      .from("assets")
      .select("status, category, criticality");
    
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
